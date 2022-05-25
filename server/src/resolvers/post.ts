import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { Deck } from "../entities/Deck";
import { workerData } from "worker_threads";

@InputType()
class PostInput {
  @Field(() => String)
  sentence!: string;

  @Field(() => String)
  word!: string;

  @Field({nullable: true})
  dictionaryAudio?: string;

  @Field({nullable: true})
  userAudio?: string;
  
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
      dictionaryAudio: options.dictionaryAudio,
      userAudio: options.userAudio,
      deck: currentDeck
     });

    if (!post){
      return {
        error: "Couldn't create Post"
      }
    }

    await em.persistAndFlush(post);
    
    if (!currentDeck.posts){
      return {
        error: "There are no posts in this"
      }
    }

    let postsAmount = currentDeck.posts.length;

    if (!postsAmount){
      return {
        error: "Couldn't get post amount"
      }
    }
    currentDeck.posts[postsAmount] = post;

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
