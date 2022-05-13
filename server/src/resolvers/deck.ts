import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Deck } from "../entities/Deck";
import { User } from "../entities/User";

@ObjectType()
class DeckResponse {
  @Field(() => String, { nullable: true })
  errors?: String;

  @Field(() => [Deck], { nullable: true })
  decks?: Deck[];
}

@Resolver()
export class DeckResolver {
  @Query(() => [Deck])
  async getAllDecks(@Ctx() { em }: MyContext): Promise<Deck[]> {
    return em.find(Deck, {});
  }

  @Query(() => DeckResponse)
  async getMyDecks(@Ctx() { req, em }: MyContext): Promise<DeckResponse> {

    console.log(req.session.userId)

    const user = await em.findOne(User, { _id: req.session.userId });

    
    if (!user) {
      return {
        errors: "user not found",
      };
    }

    const decks = await em.find(Deck, { author: user });

    if (!decks) {
      return {
        errors: "No decks found",
      };
    }

    return {
      decks
    };
  }

  @Query(() => Deck, { nullable: true })
  findDeck(
    @Arg("_id", () => Int) _id: number,
    @Ctx() { em }: MyContext
  ): Promise<Deck | null> {
    return em.findOne(Deck, { _id });
  }

  @Mutation(() => Deck)
  async createDeck(
    @Arg("title") title: string,
    @Ctx() { em, req }: MyContext
  ): Promise<Deck> {
    const user = await em.findOne(User, { _id: req.session.userId });

    const deck = await em.create(Deck, { title, author: user });
    await em.persistAndFlush(deck);
    return deck;
  }

  @Mutation(() => Deck, { nullable: true })
  async updateDeckTitle(
    @Arg("_id") _id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Deck | null> {
    const deck = await em.findOne(Deck, { _id });
    if (!deck) {
      return null;
    }

    deck.title = title;
    await em.persistAndFlush(deck);

    return deck;
  }

  @Mutation(() => Boolean)
  async removeDeck(
    @Arg("_id") _id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    const deck = await em.findOne(Deck, { _id });
    if (!deck) {
      return false;
    }
    await em.removeAndFlush(deck);

    return true;
  }
}
