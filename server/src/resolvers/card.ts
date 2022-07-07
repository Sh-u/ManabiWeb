import { Card } from "../entities/Card";
import { KotuParseResponse, KotuSegmentResponse, MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Deck } from "../entities/Deck";
import { workerData } from "worker_threads";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import path from "path";
import { createWriteStream, mkdir, rm, access, existsSync } from "fs";
import { Length } from "class-validator";
import { CardProgress } from "../entities/CardProgress";
import { Loaded } from "@mikro-orm/core/typings";
import { AsyncLocalStorage } from "async_hooks";
import { User } from "../entities/User";
import { PitchAccent } from "../entities/PitchAccent";
import { PitchTypes } from "../types";

@InputType()
class CardInput {
  @Field(() => String)
  @Length(5, 50)
  sentence!: string;

  @Field(() => String)
  @Length(5, 15)
  word!: string;
}

@ObjectType()
class CardResponse {
  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => Card, { nullable: true })
  card?: Card;
}

@ObjectType()
class LearnAndReviewResponse {
  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => [Card], { nullable: true })
  learn?: Card[];

  @Field(() => [Card], { nullable: true })
  review?: Card[];
}

@Resolver()
export class CardResolver {
  @Query(() => [Card])
  async getCards(@Ctx() { em }: MyContext): Promise<Card[]> {
    return em.find(Card, {});
  }

  @Mutation(() => Boolean, { nullable: true })
  async segmentTest(
    @Arg("words", () => String) words: string
  ): Promise<boolean> {
    const kotuSegmentResponse = await fetch(
      "https://kotu.io/api/dictionary/segment",
      {
        method: "POST",
        body: words,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!kotuSegmentResponse) {
      return false;
    }

    const parsed: KotuSegmentResponse = await kotuSegmentResponse.json();

    const values = ["d", "a"];

    const kotuParseResponse = await fetch(
      "https://kotu.io/api/dictionary/parse",
      {
        method: "POST",
        body: words,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const parsed2: KotuParseResponse = await kotuParseResponse.json();

    console.log(
      parsed2[0].accentPhrases.map(
        (obj) => obj.components[0].pitchAccents[0].descriptive
      )
    );

    return true;
  }

  @Query(() => LearnAndReviewResponse)
  async getLearnAndReviewCards(
    @Arg("deckId", () => Int) deckId: number,
    @Ctx() { em }: MyContext
  ): Promise<LearnAndReviewResponse> {
    const currentDeck = await em.findOne(
      Deck,
      { _id: deckId },
      { populate: ["cards"] }
    );

    if (!currentDeck) {
      return {
        error: "Deck not found",
      };
    }

    const cards = await em.find(
      Card,
      { deck: currentDeck },
      { populate: ["cardProgresses"] }
    );

    if (!cards) {
      return {
        error: "Cards not found",
      };
    }
    const currentDate = new Date();
    const result = cards.reduce<Record<string, Card[]>>(
      (acc, card) => {
        if (
          card.cardProgresses
            .toArray()
            .find((progress) => progress.nextRevision < currentDate)
        ) {
          if (
            card.cardProgresses.toArray().find((progress) => progress.steps > 2)
          ) {
            acc.review.push(card);
          } else {
            acc.learn.push(card);
          }
        }

        return acc;
      },
      { learn: [], review: [] }
    );

    return result;
  }

  @Query(() => Card, { nullable: true })
  async getStudyCard(@Ctx() { em, req }: MyContext): Promise<Card | null> {
    const currentUser = await em.findOne(User, { _id: req.session.userId });

    if (!currentUser) {
      return null;
    }

    const myProgressess = await em.find(
      CardProgress,
      { user: currentUser },
      { populate: ["card.pitchAccent"] }
    );

    const currentDate = new Date();
    const readyProgresses = myProgressess.filter(
      (progress) => progress.nextRevision < currentDate
    );

    if (!readyProgresses || readyProgresses.length === 0) {
      return null;
    }

    console.log(myProgressess[0].card.pitchAccent?.toArray()[0]);

    return readyProgresses[0].card;
  }

  @Mutation(() => CardResponse)
  async createCard(
    @Arg("options") options: CardInput,
    @Arg("deckId", () => Int) deckId: number,
    // @Arg("audio", () =>GraphQLUpload ) audio: FileUpload,
    @Arg("image", () => GraphQLUpload, { nullable: true }) image: FileUpload,
    @Arg("audio", () => GraphQLUpload, { nullable: true }) audio: FileUpload,
    @Ctx() { em }: MyContext
  ): Promise<CardResponse> {
    if (options.sentence.length < 1 || options.word.length < 1) {
      return {
        error: "Input is too short",
      };
    }
    const currentDeck = await em.findOne(Deck, { _id: deckId });

    if (!currentDeck) {
      return {
        error: "Couldn't find a current deck in Card/Resolver",
      };
    }

    const jpRegex =
      /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g;
    const isInputJPchar: boolean = jpRegex.test(options.word);

    let scrapedWordAudio: string | null = null;
    let scrapedWordMeaning: string | null = null;
    let scrapedPitchAccent = null;
    let scrapedFurigana: string | null = null;

    let descriptiveResponse: Array<PitchTypes> | null = null;

    let moraResponse = null;
    let wordsToParse: string[] | null = null;
    let sentenceArray: string[] | null = null;
    let kanaResponse: string[] | null = null;

    if (currentDeck.japaneseTemplate && isInputJPchar) {
      const reqWordBody = {
        query: options.word,
        language: "English",
        no_english: false,
      };

      const jotobaResponse = await fetch("https://jotoba.de/api/search/words", {
        method: "POST",
        body: JSON.stringify(reqWordBody),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const kotuSegmentResponse = await fetch(
        "https://kotu.io/api/dictionary/segment",
        {
          method: "POST",
          body: options.sentence,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (kotuSegmentResponse) {
        const parsed: KotuSegmentResponse = await kotuSegmentResponse.json();

        wordsToParse = parsed[0]
          .filter((obj) => obj.partOfSpeech !== "助詞")
          .map((obj) => obj.surface ?? null);

        sentenceArray = parsed[0].map((obj) => obj.surface);
        console.log("wordsToParse", wordsToParse);
      }

      const kotuParseResponse = await fetch(
        "https://kotu.io/api/dictionary/parse",
        {
          method: "POST",
          body: wordsToParse?.join(""),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (kotuParseResponse) {
        const parsed: KotuParseResponse = await kotuParseResponse.json();

        moraResponse = parsed[0].accentPhrases.map(
          (obj) => obj.components[0].pitchAccents[0].mora
        );

        console.log("moraResponse", moraResponse);

        descriptiveResponse = parsed[0].accentPhrases.map(
          (obj) => obj.components[0].pitchAccents[0].descriptive
        );

        console.log("descriptiveResponse", descriptiveResponse);

        kanaResponse = parsed[0].accentPhrases.map(
          (obj) => obj.components[0].kana
        );

        console.log("kanaResponse", kanaResponse);
      }

      if (jotobaResponse) {
        const parsed = await jotobaResponse.json();

        const firstObjectWithAudio = parsed.words.find((obj: any) => obj.audio);

        const furigana =
          options.word.length === 1
            ? parsed.kanji[0].kunyomi[0]
            : parsed.words[0].reading.kana;

        const meaning = firstObjectWithAudio?.senses[0]?.glosses;

        const pitch = firstObjectWithAudio?.pitch;

        scrapedWordAudio = `https://jotoba.de${firstObjectWithAudio?.audio}`;
        scrapedWordMeaning = meaning;
        scrapedPitchAccent = pitch;
        scrapedFurigana = furigana;

        // console.log("scrapedPitchAccent", scrapedPitchAccent);
      }
    }

    await em.begin();

    try {
      const card = await em.create(Card, {
        sentence: options.sentence,
        sentenceArr: sentenceArray,
        word: options.word,
        deck: currentDeck,
        dictionaryAudio: scrapedWordAudio,
        dictionaryMeaning: scrapedWordMeaning,
        furigana: scrapedFurigana,
      });

      if (
        scrapedPitchAccent &&
        moraResponse &&
        descriptiveResponse &&
        wordsToParse &&
        kanaResponse
      ) {
        for (let i = 0; i < moraResponse.length; i++) {
          const part = await em.create(PitchAccent, {
            descriptive: descriptiveResponse[i],
            word: wordsToParse[i],
            kana: kanaResponse[i],
            mora: moraResponse[i],
            card: card,
          });

          await em.persist(part);
        }
      }

      const progress = await em.create(CardProgress, {
        card: card,
        user: card.deck.user._id,
      });

      await em.persist(progress);

      try {
        await em.persistAndFlush(card);
      } catch (err) {
        console.log(err);
      }

      if (image) {
        image.filename = `image-${card._id}`;
      }
      if (audio) {
        audio.filename = `audio-${card._id}`;
      }

      const basePath = path.join(
        `userFiles/user-${currentDeck.user._id}/deck-${currentDeck._id}/card-${card._id}/`
      );
      const targetPath = path.resolve("..", "web", "public", basePath);

      await mkdir(targetPath, (err) => {
        return console.log(`error while creating a dir `, err);
      });

      console.log(`basePath: `, basePath);
      console.log(`targetPath: `, targetPath);

      const imgMimes = ["image/jpeg", "image/png", "image/jpg", "image/jpeg"];
      const audioMimes = ["audio/mp3", "audio/wav", "audio/ogg", "audio/mp3"];
      if (image && imgMimes.some((item) => item === image.mimetype)) {
        console.log("writing image");
        await new Promise((resolve, reject) => {
          image
            .createReadStream()
            .pipe(createWriteStream(path.join(targetPath, image.filename)))
            .on("finish", () => {
              console.log("finish");
              resolve(true);
            })
            .on("error", () => {
              console.log("error");
              reject(false);
            });
        });
        card.image = path.join(basePath, image.filename);
      }

      if (audio && audioMimes.some((item) => item === audio.mimetype)) {
        console.log("writing audio");
        await new Promise((resolve, reject) => {
          audio
            .createReadStream()
            .pipe(createWriteStream(path.join(targetPath, audio.filename)))
            .on("finish", () => {
              console.log("finish");
              resolve(true);
            })
            .on("error", () => {
              console.log("error");
              reject(false);
            });
        });
        card.userAudio = path.join(basePath, audio.filename);
      }

      await em.commit();

      return {
        card: card,
      };
    } catch (e) {
      await em.rollback();
      throw e;
    }
  }

  @Mutation(() => Card, { nullable: true })
  async updateCardTitle(
    @Arg("_id") _id: number,
    @Ctx() { em }: MyContext
  ): Promise<Card | null> {
    const card = await em.findOne(Card, { _id });
    if (!card) {
      return null;
    }

    // post.title = title;
    await em.persistAndFlush(card);

    return card;
  }

  @Mutation(() => CardResponse)
  async editCard(
    @Arg("targetId", () => Int) targetId: number,
    @Arg("image", () => GraphQLUpload, { nullable: true }) image: FileUpload,
    @Arg("audio", () => GraphQLUpload, { nullable: true }) audio: FileUpload,
    @Arg("options") options: CardInput,
    @Ctx() { em }: MyContext
  ): Promise<CardResponse> {
    if (options.sentence.length < 1 || options.word.length < 1) {
      return {
        error: "Input is too short",
      };
    }
    const card = await em.findOne(Card, { _id: targetId });

    if (!card) {
      return {
        error: "Could not find a matching card",
      };
    }

    await em.begin();

    try {
      card.sentence = options.sentence;
      card.word = options.word;

      if (image) {
        console.log("mime", image.mimetype);
        image.filename = `image-${card._id}`;
      }
      if (audio) {
        console.log("mime", audio.mimetype);
        audio.filename = `audio-${card._id}`;
      }

      const basePath = path.join(
        `userFiles/user-${card.deck.user._id}/deck-${card.deck._id}/card-${card._id}/`
      );
      const targetPath = path.resolve("..", "web", "public", basePath);

      const imgMimes = ["image/jpeg", "image/png", "image/jpg", "image/jpeg"];
      const audioMimes = ["audio/mp3", "audio/wav", "audio/ogg", "audio/mp3"];
      if (image && imgMimes.some((item) => item === image.mimetype)) {
        console.log("writing image");
        await new Promise((resolve, reject) => {
          image
            .createReadStream()
            .pipe(createWriteStream(path.join(targetPath, image.filename)))
            .on("finish", () => {
              console.log("finish");
              resolve(true);
            })
            .on("error", () => {
              console.log("error");
              reject(false);
            });
        });

        card.image = path.join(basePath, image.filename);
      }

      if (audio && audioMimes.some((item) => item === audio.mimetype)) {
        console.log("writing audio");
        await new Promise((resolve, reject) => {
          audio
            .createReadStream()
            .pipe(createWriteStream(path.join(targetPath, audio.filename)))
            .on("finish", () => {
              console.log("finish");
              resolve(true);
            })
            .on("error", () => {
              console.log("error");
              reject(false);
            });
        });
        card.userAudio = path.join(basePath, audio.filename);
      }

      em.persist(card);
      await em.commit();

      return {
        card: card,
      };
    } catch (e) {
      await em.rollback();
      throw e;
    }
  }

  @Mutation(() => Boolean)
  async deleteCard(
    @Arg("targetId", () => Int) targetId: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    const card = await em.findOne(Card, { _id: targetId });

    if (!card) {
      return false;
    }

    const basePath = path.join(
      `userFiles/user-${card.deck.user._id}/deck-${card.deck._id}/card-${card._id}/`
    );
    const targetPath = path.resolve("..", "web", "public", basePath);

    await em.begin();
    try {
      em.remove(card);

      if (existsSync(targetPath)) {
        rm(targetPath, { recursive: true }, (err) => {
          if (err) {
            throw err;
          }

          console.log(`${targetPath} is deleted!`);
        });
      }

      await em.commit();
    } catch (e) {
      await em.rollback();
      throw e;
    }

    return true;
  }
}
