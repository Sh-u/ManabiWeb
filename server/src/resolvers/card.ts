import { Card } from "../entities/Card";
import {
  JotobaResponse,
  KotuParseResponse,
  KotuSegmentResponse,
  MyContext,
} from "../types";
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
import { jpRegex } from "../utility/jpRegex";

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
  async deleteCards(
    @Arg("cardId", () => Int) cardId: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    const card = await em.findOne(Card, { _id: cardId }, { populate: true });
    if (!card) {
      return false;
    }

    try {
      card.pitchAccent?.removeAll();
      card.cardProgresses?.removeAll();

      await em.removeAndFlush(card);
    } catch (err) {
      console.log(err);
    }

    return true;
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

    const sdsd = [-1];

    const kotuMora = parsed2[0].accentPhrases.map((obj) => {
      return obj.components[0].pitchAccents[0];
    });

    const kotuKana = parsed2[0].accentPhrases.map(
      (obj) => obj.components[0].kana
    );

    const kotuWord = parsed2[0].accentPhrases.map(
      (obj) => obj.components[0].surface
    );

    console.log("kotuMora", kotuMora);
    console.log("kotuKana", kotuKana);
    console.log("kotuWord", kotuWord);

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
            card.cardProgresses
              .toArray()
              .find((progress) => progress?.steps > 2)
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

    console.log(readyProgresses[0].card.pitchAccent?.toArray()[0]?.high);

    return readyProgresses[0].card;
  }

  @Mutation(() => CardResponse)
  async createCard(
    @Arg("options") options: CardInput,
    @Arg("deckId", () => Int) deckId: number,
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

    console.log("options_________________________", options);
    const isInputJPchar: boolean = jpRegex.test(options.word);

    let jotobaWordAudio: string | null = null;
    let jotobaWordMeaning: string[] | null = null;
    let jotobaPitchAccent = null;
    let jotobaFurigana: string | null = null;
    let jotobaPitchHighs: boolean[] | null = null;
    let jotobaPitchParts: string[] | null = null;

    let kotuDescriptive: Array<PitchTypes> | null = null;
    let kotuMora = null;
    let kotuKana: string[] | null = null;
    let kotuWord: string[] | null = null;

    let wordsToParse: string[] | null = null;
    let showKanaResponse: boolean[] | null = null;

    if (currentDeck.japaneseTemplate && isInputJPchar) {
      const requestJotobaWord = {
        query: options.word,
        language: "English",
        no_english: false,
      };

      const jotobaResponse = await fetch("https://jotoba.de/api/search/words", {
        method: "POST",
        body: JSON.stringify(requestJotobaWord),
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
          .filter((obj) => obj.partOfSpeech !== "補助記号" && obj.partOfSpeech !== "空白")
          .map((obj) => obj.surface ?? null);

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

        kotuMora = parsed[0].accentPhrases.map(
          (obj) => obj.components[0].pitchAccents[0].mora
        );

        console.log("moraResponse", kotuMora);

        kotuDescriptive = parsed[0].accentPhrases.map(
          (obj) => obj.components[0].pitchAccents[0].descriptive
        );

        console.log("descriptiveResponse", kotuDescriptive);

        kotuKana = parsed[0].accentPhrases.map((obj) => obj.components[0].kana);

        console.log("kanaResponse", kotuKana);

        showKanaResponse = parsed[0].accentPhrases.map(
          (obj) => obj.components[0].kana !== obj.components[0].surface
        );

        console.log("showKanaResponse", showKanaResponse);

        kotuWord = parsed[0].accentPhrases.map(
          (obj) => obj.components[0].surface
        );

        console.log("kotuWord", kotuWord);
      }

      if (jotobaResponse) {
        const parsed: JotobaResponse = await jotobaResponse.json();

        const firstObjectWithMatchingWord = parsed.words.find((obj: any) =>
          kotuKana?.includes(obj.reading.kana)
        );

        console.log("firstObjectWithMatchingWord", firstObjectWithMatchingWord);
        const firstObjectWithAudio = parsed.words.find((obj: any) => obj.audio);
        const firstObjectNoAudio = parsed.words[0];

        jotobaFurigana =
          options.word.length === 1
            ? parsed.kanji[0].kunyomi[0]
            : parsed.words[0].reading.kana;

        jotobaWordMeaning =
          firstObjectWithMatchingWord?.senses[0].glosses ?? null
          // ??
          // firstObjectWithAudio?.senses[0].glosses ??
          // firstObjectNoAudio.senses[0].glosses;

        const pitch =
          firstObjectWithMatchingWord?.pitch 
          // ??
          // firstObjectWithAudio?.pitch ??
          // firstObjectNoAudio?.pitch;

        jotobaWordAudio = firstObjectWithMatchingWord?.audio ? `https://jotoba.de${firstObjectWithMatchingWord?.audio}` : null;
        // ?? `https://jotoba.de${firstObjectWithAudio?.audio}`
         

        jotobaPitchHighs = pitch?.map((obj) => obj.high) ?? null;
        jotobaPitchParts = pitch?.map((obj) => obj.part) ?? null;

        console.log("meaning", jotobaWordMeaning);

        console.log("highs", jotobaPitchHighs);
        console.log("parts", jotobaPitchParts);
      }
    }

    await em.begin();

    try {
      const card = await em.create(Card, {
        sentence: options.sentence,
        sentenceArr: wordsToParse,
        word: options.word,
        deck: currentDeck,
        dictionaryAudio: jotobaWordAudio,
        dictionaryMeaning: jotobaWordMeaning,
        furigana: jotobaFurigana,
      });

      console.log("kotumora", kotuMora);
      if (kotuMora?.length) {
        for (let i = 0; i < kotuMora.length; i++) {
          const part = await em.create(PitchAccent, {
            part: jotobaPitchParts && jotobaPitchParts,
            high: jotobaPitchHighs && jotobaPitchHighs,
            showKana: showKanaResponse && showKanaResponse[i],
            descriptive: kotuDescriptive && kotuDescriptive[i],
            word: kotuWord && kotuWord[i],
            kana: kotuKana && kotuKana[i],
            mora: kotuMora && kotuMora[i],
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
