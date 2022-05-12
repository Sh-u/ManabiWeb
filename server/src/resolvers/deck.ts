import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Deck } from "../entities/Deck";
import { User } from "../entities/User";



  

@Resolver()
export class DeckResolver {
  @Query(() => [Deck])
  async posts(@Ctx() { em }: MyContext): Promise<Post[]> {
  
    return em.find(Post, {});
  }

  @Query(() => Deck, { nullable: true })
  post(
    @Arg("_id", () => Int) _id: number,
    @Ctx() { em }: MyContext
  ): Promise<Deck | null> {

    return em.findOne(Deck, { _id });
  }

  @Mutation(() => Deck)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { em, req }: MyContext
  ): Promise<Deck> {
    const user = await em.findOne(User, {_id: req.session.userId})



    const deck = await em.create(Deck, { title, author: user });
    await em.persistAndFlush(deck);
    return deck;
  }

  @Mutation(() => Deck, { nullable: true })
  async updatePostTitle(
    @Arg("_id") _id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Deck | null> {
    const post = await em.findOne(Deck, { _id });
    if (!post) {
      return null;
    }

    post.title = title;
    await em.persistAndFlush(post);

    return post;
  }

  @Mutation(() => Boolean)
  async removePost(
    @Arg("_id") _id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    const post = await em.findOne(Deck, { _id });
    if (!post) {
      return false;
    }
    await em.removeAndFlush(post);

    return true;
  }
}
