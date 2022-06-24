import { Post } from "../entities/Post";
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

@InputType()
class PostInput {
  @Field(() => String)
  @Length(5, 50)
  sentence!: string;

  @Field(() => String)
  @Length(5, 15)
  word!: string;
}

@ObjectType()
class PostResponse {
  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => Post, { nullable: true })
  post?: Post;
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("_id", () => Int) _id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return em.findOne(Post, { _id });
  }

  @Mutation(() => PostResponse)
  async createPost(
    @Arg("options") options: PostInput,
    @Arg("deckId", () => Int) deckId: number,
    // @Arg("audio", () =>GraphQLUpload ) audio: FileUpload,
    @Arg("image", () => GraphQLUpload, { nullable: true }) image: FileUpload,
    @Arg("audio", () => GraphQLUpload, { nullable: true }) audio: FileUpload,
    @Ctx() { em }: MyContext
  ): Promise<PostResponse> {
    if (options.sentence.length < 1 || options.word.length < 1) {
      return {
        error: "Input is too short",
      };
    }
    const currentDeck = await em.findOne(Deck, { _id: deckId });

    if (!currentDeck) {
      return {
        error: "Couldn't find a current deck in Post/Resolver",
      };
    }

    await em.begin();

    try {
      //... do some work
      const post = await em.create(Post, {
        sentence: options.sentence,
        word: options.word,
        deck: currentDeck,
      });

      try {
        await em.persistAndFlush(post);
      } catch (err) {
        console.log(err);
      }

      if (image) {
        console.log("mime", image.mimetype);
        image.filename = `image-${post._id}`;
      }
      if (audio) {
        console.log("mime", audio.mimetype);
        audio.filename = `audio-${post._id}`;
      }

      const basePath = path.join(
        `userFiles/user-${currentDeck.user._id}/deck-${currentDeck._id}/post-${post._id}/`
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
        post.image = path.join(basePath, image.filename);
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
        post.userAudio = path.join(basePath, audio.filename);
      }

      await em.commit(); // will flush before making the actual commit query

      return {
        post,
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

  @Mutation(() => Post, { nullable: true })
  async updatePostTitle(
    @Arg("_id") _id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { _id });
    if (!post) {
      return null;
    }

    // post.title = title;
    await em.persistAndFlush(post);

    return post;
  }

  @Mutation(() => PostResponse)
  async editPost(
    @Arg("targetId", () => Int) targetId: number,
    @Arg("image", () => GraphQLUpload, { nullable: true }) image: FileUpload,
    @Arg("audio", () => GraphQLUpload, { nullable: true }) audio: FileUpload,
    @Arg("options") options: PostInput,
    @Ctx() { em }: MyContext
  ): Promise<PostResponse> {
    if (options.sentence.length < 1 || options.word.length < 1) {
      return {
        error: "Input is too short",
      };
    }
    const post = await em.findOne(Post, { _id: targetId });

    if (!post) {
      return {
        error: "Could not find a matching post",
      };
    }


    await em.begin();

    try {

      post.sentence = options.sentence;
      post.word = options.word;
  
      if (image) {
        console.log("mime", image.mimetype);
        image.filename = `image-${post._id}`;
      }
      if (audio) {
        console.log("mime", audio.mimetype);
        audio.filename = `audio-${post._id}`;
      }

      const basePath = path.join(
        `userFiles/user-${post.deck.user._id}/deck-${post.deck._id}/post-${post._id}/`
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


        post.image = path.join(basePath, image.filename);
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
        post.userAudio = path.join(basePath, audio.filename);
      }

      em.persist(post);
      await em.commit();

      return {
        post,
      };
    } catch (e) {
      await em.rollback();
      throw e;
    }
 
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("targetId", () => Int) targetId: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    const post = await em.findOne(Post, { _id: targetId });

    if (!post) {
      return false;
    }

    const basePath = path.join(
      `userFiles/user-${post.deck.user._id}/deck-${post.deck._id}/post-${post._id}/`
    );
    const targetPath = path.resolve("..", "web", "public", basePath);

    await em.begin();
    try {
      em.remove(post);

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
