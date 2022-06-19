import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { Deck } from "../entities/Deck";
import { workerData } from "worker_threads";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import path from "path";
import {createWriteStream} from 'fs'
@InputType()
class PostInput {
  @Field(() => String)
  sentence!: string;

  @Field(() => String)
  word!: string;

  // @Field({nullable: true})
  // dictionaryAudio?: string;

  // @Field({nullable: true})
  // userAudio?: string;
  
}


@ObjectType()
class PostResponse {
  @Field(() => String)
  error?: string;

  @Field(() => Post)
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
    @Arg("deckId") deckId: number,
    @Arg("audio", () =>GraphQLUpload ) audio: FileUpload,
    @Arg("image", () =>GraphQLUpload ) image: FileUpload,
    @Ctx() { em }: MyContext
  ): Promise<PostResponse> {

    

    const currentDeck = await em.findOne(Deck, {_id: deckId})

    if (!currentDeck){
      return {
        error: "Couldn't find a current deck in Post/Resolver"
      }
    }

    const post = await em.create(Post, {
      sentence: options.sentence,
      word: options.word,
      deck: currentDeck
     });

    if (!post){
      return {
        error: "Couldn't create Post"
      }
    }

    console.log('created post object')
    
    const basePathImage = path.join(`userFiles/${currentDeck.user._id}/deck-${currentDeck._id}/post/${post._id}/`, image.filename)
    const basePathAudio = path.join(`userFiles/${currentDeck.user._id}/deck-${currentDeck._id}/post/${post._id}/`, audio.filename)


    const targetPathImage = path.resolve('..', 'web', 'public', basePathImage);
    const targetPathAudio = path.resolve('..', 'web', 'public', basePathAudio);

    await new Promise((resolve, reject) => {
      image.createReadStream()
      .pipe(createWriteStream(targetPathImage))
      .on('finish', () => {
        console.log('finish')
        resolve(true)
      })
      .on('error', () => {
        console.log('error')
        reject(false)
      })
    })

    await new Promise((resolve, reject) => {
      audio.createReadStream()
      .pipe(createWriteStream(targetPathAudio))
      .on('finish', () => {
        console.log('finish')
        resolve(true)
      })
      .on('error', () => {
        console.log('error')
        reject(false)
      })
    })

    const imgMimes = [".jpeg", ".png", ".jpg"]
    const audioMimes = [".mp3", ".wav", ".ogg"]
    if (imgMimes.some((item) => item === image.mimetype )){
      console.log('imgMime')
      post.image = basePathImage;
    }

    if (audioMimes.some((item) => item === audio.mimetype )){
      console.log('imgMime')
      post.userAudio = basePathAudio;
      
    }

    try {
      await em.persistAndFlush(post);
    }
    catch (err) {
      console.log(err)
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

    return {
      post
    }
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
