import { doesNotReject } from "assert";
import { DeckSubscriber } from "../entities/DeckSubscriber";
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
import { MyContext } from "../types";

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
  async searchForDeck(
    @Arg("input", () => String) input: string,
    @Ctx() { em }: MyContext
  ): Promise<Deck[]> {

    const allDecks = await em.find(Deck, {});

    console.log(input)
    const decks = allDecks.filter((deck) => deck.title.toLowerCase().includes(input.toLowerCase()))
    // console.log('decks: ', decks)
    if (decks.length < 1){
      return [];
    }

    return decks;
  }

  @Query(() => [Deck])
  async getAllDecks(@Ctx() { em }: MyContext): Promise<Deck[]> {
    return await em.find(Deck, {});
  }

  @Query(() => DeckResponse)
  async getMyDecks(@Ctx() { req, em }: MyContext): Promise<DeckResponse> {
    const user = await em.findOne(User, { _id: req.session.userId });

    if (!user) {
      return {
        errors: "user not found",
      };
    }

    const ownerDecks = await em.find(Deck, { user: user });
    const subscriberDecks = await em.find(Deck, {
      subscribers: { _id: user._id },
    });
    // console.log(`sub decks`, subscriberDecks)

    // console.log('decks', ownerDecks)

    if (!ownerDecks) {
      return {
        errors: "No decks found",
      };
    }

    if (!subscriberDecks) {
      return {
        errors: "No subscribers decks found",
      };
    }

    if (ownerDecks.length < 1) {
      return {
        errors: "Looks like you have no decks created...",
      };
    }

    console.log("success getting decks");
    return {
      decks: [...ownerDecks, ...subscriberDecks],
    };
  }

  @Query(() => DeckResponse)
  async findDeck(
    @Arg("_id", () => Int) _id: number,
    @Ctx() { em }: MyContext
  ): Promise<DeckResponse> {
    const deck = await em.findOne(Deck, { _id });

    if (!deck) {
      return {
        errors: "Couldn't find the deck you searched for",
      };
    }

    const user = await em.findOne(User, { _id: deck?.user._id });

    if (!user) {
      return {
        errors: "Couldn't find the user owning this deck",
      };
    }

    return {
      decks: [deck],
    };
  }

  @Mutation(() => DeckResponse)
  async createDeck(
    @Arg("title") title: string,
    @Ctx() { em, req }: MyContext
  ): Promise<DeckResponse> {
    const user = await em.findOne(User, { _id: req.session.userId });

    if (title.length < 4 || title.length > 30) {
      return {
        errors: "Invalid title length",
      };
    }

    if (!user) {
      return {
        errors: "Cannot Create Deck: USER NOT FOUND",
      };
    }

    const deck = await em.create(Deck, { title, user: user });
    try {
      await em.persistAndFlush(deck);
    } catch (err) {
      console.log(err);
    }

    return {
      decks: [deck],
    };
  }

  @Mutation(() => DeckResponse)
  async subscribeToDeck(
    @Arg("deckId") deckId: Number,
    @Ctx() { em, req }: MyContext
  ): Promise<DeckResponse> {
    const currentUser = await em.findOne(User, { _id: req.session.userId });

    if (!currentUser) {
      return {
        errors: "Cannot subscribe to deck: User not found",
      };
    }

    const deck = await em.findOne(Deck, { _id: deckId });
    if (!deck) {
      return {
        errors: "Cannot subscribe to deck: Deck not found",
      };
    }

    console.log("subs:    ", deck.subscribers.toArray());

    if (
      deck.subscribers.toArray().some((user) => user._id === currentUser._id)
    ) {
      return {
        errors: "You are already subscribed to this deck",
      };
    }

    await deck.subscribers.add(currentUser);

    try {
      await em.persistAndFlush(deck);
    } catch (err) {
      console.log(err);
    }

    return {
      decks: [deck],
    };
  }

  @Mutation(() => Boolean)
  async unsubscribeToDeck(
    @Arg("deckId") deckId: Number,
    @Ctx() { em, req }: MyContext
  ): Promise<Boolean> {
    const currentUser = await em.findOne(User, { _id: req.session.userId });
    if (!currentUser) {
      console.log("unsubscribeToDeck error: user not found");
      return false;
    }

    const deck = await em.findOne(Deck, { _id: deckId });
    if (!deck) {
      console.log("unsubscribeToDeck error: deck not found");
      return false;
    }
    // deck.subscribers.init()

    console.log(deck);
    if (!deck.subscribers.isInitialized()) {
      await deck.subscribers.init();
      console.log("unitialized");
      return false;
    }

    if (
      !deck.subscribers.getItems().some((user) => user._id === currentUser._id)
    ) {
      console.log("unsubscribeToDeck error: user not found on the deck");
      return false;
    }

    console.log("removing");
    await deck.subscribers.remove(currentUser);

    try {
      await em.persistAndFlush(deck);
    } catch (err) {
      console.log(err);
    }

    return true;
  }

  @Mutation(() => Deck, { nullable: true })
  async renameDeck(
    @Arg("_id") _id: number,
    @Arg("title", () => String) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Deck | null> {
    if (title.length < 3) {
      return null;
    }
    const deck = await em.findOne(Deck, { _id });
    if (!deck) {
      return null;
    }

    deck.title = title;
    await em.persistAndFlush(deck);

    return deck;
  }

  @Mutation(() => Boolean)
  async deleteDeck(
    @Arg("_id") _id: number,
    @Ctx() { em, req }: MyContext
  ): Promise<Boolean> {
    const currentUser = await em.findOne(User, { _id: req.session.userId });

    if (!currentUser) {
      console.log("cannot remove deck: user not found");
      return false;
    }
    const deck = await em.findOne(Deck, { _id });
    if (!deck) {
      return false;
    }
    if (!deck.subscribers.isInitialized()) {
      await deck.subscribers.init();
    }
    if (deck.user._id === currentUser?._id) {

      if (deck.subscribers.count() > 0) {
        console.log('removing subs')
        const deckSubs = await em.find(DeckSubscriber, {deck: deck})
        await em.removeAndFlush(deckSubs)
      }
      console.log('removing owner deck')
      await em.removeAndFlush(deck);
 
    } else if (
      deck.subscribers.toArray().some((user) => user._id === currentUser._id)
    ) {
      console.log("removing subscription");
      await deck.subscribers.remove(currentUser);
    }

    return true;
  }
}
