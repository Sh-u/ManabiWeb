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
import { PrimaryKey } from "@mikro-orm/core/decorators/PrimaryKey";

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

    if (decks.length < 1){
      return {
        errors: "Looks like you have no decks created...",
      };
    }

    

    console.log('success getting decks')
    return {
      decks
    };
  }

  @Query(() => Deck, { nullable: true })
  async findDeck(
    @Arg("_id", () => Int) _id: number,
    @Ctx() { em }: MyContext
  ): Promise<Deck | null> {
   



    const deck = await em.findOne(Deck, { _id });

    if (!deck){
      return null;
    }
    
    const user = await em.findOne(User, { _id: deck?.author._id });

  
    if (!user){
      console.log('no user')
    }
 
    return deck;
  }

  @Mutation(() => DeckResponse)
  async createDeck(
    @Arg("title") title: string,
    @Ctx() { em, req }: MyContext
  ): Promise<DeckResponse> {
    const user = await em.findOne(User, { _id: req.session.userId });

    if (title.length < 4 || title.length > 30){
      return {
        errors: "Invalid title length",
      };
    }

    if (!user) {
      return {
        errors: "Cannot Create Deck: USER NOT FOUND",
      };
    }

    const deck = await em.create(Deck, { title, author: user });
    try {
      await em.persistAndFlush(deck);
    } catch (err){
      console.log(err)
    }
   

   
    return {
      decks: [deck]
    };
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
