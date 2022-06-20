import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { Deck } from "../entities/Deck";
import { workerData } from "worker_threads";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import path from "path";
import {createWriteStream, mkdir} from 'fs'
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
    @Arg("image", () =>GraphQLUpload ) image: FileUpload,
    @Ctx() { em }: MyContext
  ): Promise<PostResponse> {

    console.log('mime', image.mimetype)
    // const parsedId = Number(deckId);
    // console.log(deckId)

    if (options.sentence.length < 1 || options.word.length < 1){
      return {
        error: "Input is too short"
      }
    }
    const currentDeck = await em.findOne(Deck, {_id: deckId})

    if (!currentDeck){
      return {
        error: "Couldn't find a current deck in Post/Resolver"
      }
    }


    await em.begin();

    try {
      //... do some work
      const post = await em.create(Post, {

        sentence: options.sentence,
        word: options.word,
        deck: currentDeck
       });

       try {
        await em.persistAndFlush(post);
       } catch (err){
        console.log(err)
       }
 

   
     
      const baseImagePath = path.join(`userFiles/${currentDeck.user._id}/deck-${currentDeck._id}/post-${post._id}/`)

      // const basePathAudio = path.join(`userFiles/${currentDeck.user._id}/deck-${currentDeck._id}/post/${post._id}/`, audio.filename)
  
  
      const targetImagePath = path.resolve('..', 'web', 'public', baseImagePath);
      // const targetPathAudio = path.resolve('..', 'web', 'public', basePathAudio);
      await mkdir(targetImagePath, (err) => {
        return console.log(err)
      })
  
      console.log(`basePath: `, baseImagePath)
      console.log(`targetPath: `, targetImagePath)
  
      await new Promise((resolve, reject) => {
        image.createReadStream()
        .pipe(createWriteStream(path.join(targetImagePath, image.filename)))
        .on('finish', () => {
          console.log('finish')
          resolve(true)
        })
        .on('error', () => {
          console.log('error')
          reject(false)
        })
      });

      const imgMimes = [".jpeg", ".png", ".jpg", "image/jpeg"]
      const audioMimes = [".mp3", ".wav", ".ogg"]
      if (imgMimes.some((item) => item === image.mimetype )){
        console.log('imgMime')
        post.image = path.join(baseImagePath, image.filename);
      }
  

      
      await em.commit(); // will flush before making the actual commit query

      return {
        post
      }
    } catch (e) {
      await em.rollback();
      throw e;
    }

  
   
    // await new Promise((resolve, reject) => {
    //   audio.createReadStream()
    //   .pipe(createWriteStream(targetPathAudio))
    //   .on('finish', () => {
    //     console.log('finish')
    //     resolve(true)
    //   })
    //   .on('error', () => {
    //     console.log('error')
    //     reject(false)
    //   })
    // })


    // if (audioMimes.some((item) => item === audio.mimetype )){
    //   console.log('imgMime')
    //   post.userAudio = basePathAudio;
      
    // }

   
    
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

  @Mutation(() => Boolean)
  async removePost(
    @Arg("_id") _id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    const post = await em.findOne(Post, { _id });
    if (!post) {
      return false;
    }
    await em.removeAndFlush(post);

    return true;
  }
}
