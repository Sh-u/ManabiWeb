import { Card } from "../entities/Card";
import { MyContext } from "../types";
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

@Resolver()
export class CardResolver {
  @Query(() => [Card])
  async getCards(@Ctx() { em }: MyContext): Promise<Card[]> {
    return em.find(Card, {});
  }

  @Query(() => Card, { nullable: true })
  card(
    @Arg("_id", () => Int) _id: number,
    @Ctx() { em }: MyContext
  ): Promise<Card | null> {
    return em.findOne(Card, { _id });
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

    await em.begin();

    try {
      //... do some work
   
     



      const card = await em.create(Card, {
        sentence: options.sentence,
        word: options.word,
        deck: currentDeck,
      });

      const progress = await em.create(CardProgress, { card: card, user: card.deck.user._id,})

      await em.persist(progress);

      try {
        await em.persistAndFlush(card);
      } catch (err) {
        console.log(err);
      }

      if (image) {
        console.log("mime", image.mimetype);
        image.filename = `image-${card._id}`;
      }
      if (audio) {
        console.log("mime", audio.mimetype);
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

      await em.commit(); // will flush before making the actual commit query

      return {
        card: card,
      };
    } catch (e) {
      await em.rollback();
      throw e;
    }

    // if (!currentDeck.posts){
    //   return {
    //     error: "There are no posts in this"
    //   }
    // }

    // let postsAmount = currentDeck.posts.length;

    // if (!postsAmount){
    //   return {
    //     error: "Couldn't get post amount"
    //   }
    // }
    // currentDeck.posts[postsAmount] = post;
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
