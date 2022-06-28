import { Card } from "../entities/Card";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { CardProgress } from "../entities/CardProgress";
import { compareAsc, format } from "date-fns";
import add from "date-fns/add";
import { Deck } from "../entities/Deck";

type AnswerType = "GOOD" | "AGAIN";



@ObjectType()
class RevisionTimeResponse {
  @Field(() => Int, {nullable: true})
  AGAIN: number | null

  @Field(() => Int, {nullable: true})
  GOOD: number | null
}


@Resolver()
export class CardProgressResolver {
  @Query(() => RevisionTimeResponse)
  async getRevisionTime(
    @Arg("currentCardId", () => Int) currentCardId: number,
    @Ctx() { em }: MyContext
  ): Promise<RevisionTimeResponse> {

    console.log('revision')
    const card = await em.findOne(Card, { _id: currentCardId });

    if (!card) {
      return {
        AGAIN: null,
        GOOD: null,
      }
    }

    const currentCardProgress = await em.findOne(CardProgress, {
      card: card,
    });

    if (!currentCardProgress) {
      return {
        AGAIN: null,
        GOOD: null,
      }
    }

    const deckSteps = card.deck.steps;
    const ease = card.deck.startingEase;
    const cardSteps = card.cardProgresses[0].steps;

    const result: RevisionTimeResponse = {
      GOOD: null,
      AGAIN: null,
    };
    
    console.log('steps', cardSteps)
    if (cardSteps === 2){
      result.GOOD = deckSteps[2] * ease;
      console.log('res good', result.GOOD)
    }
    else if (cardSteps > 2) {
      result.GOOD = deckSteps[2] * (currentCardProgress.steps - 2) * ease;
    } else {
      result.GOOD = deckSteps[cardSteps + 1];
    }

    result.AGAIN = deckSteps[0];

    console.log('result ', result)
    return result;
  }

  @Query(() => [CardProgress], { nullable: true })
  async getCardProgresses(
    @Ctx() { em }: MyContext
  ): Promise<Array<CardProgress> | null> {
    const progress = await em.find(CardProgress, {});
    if (!progress) {
      return null;
    }
    return progress;
  }

  @Mutation(() => String, {nullable: true})
  async chooseCardDifficulty(
    @Arg("currentCardId", () => Int) currentCardId: number,
    @Arg("answerType") answerType: AnswerType,
    @Ctx() { em }: MyContext
  ): Promise<String | null> {
    const currentCard = await em.findOne(
      Card,
      { _id: currentCardId },
      { populate: ["cardProgresses"] }
    );

    if (!currentCard) {
      return null;
    }

    const currentCardProgress = await em.findOne(CardProgress, {
      card: currentCard,
    });

    if (!currentCardProgress) {
      return null;
    }
    const currentDate = new Date();

    const currentCardDeck = await em.findOne(Deck, {_id: currentCard.deck._id})

    if (!currentCardDeck) return null;


    let addMinutes;
    const deckStepsValues = currentCardDeck.steps;

 

    if (answerType === "GOOD") {
      currentCardProgress.steps++;
    } else if (answerType === "AGAIN") {
      // currentCardProgress.steps > 2
      //   ? (currentCardProgress.steps = 1)
      //   : (currentCardProgress.steps = 0);
      currentCardProgress.steps = 0;
    }

    currentCardProgress.steps > 2
      ? (currentCardProgress.state = "Review")
      : (currentCardProgress.state = "Learn");

    addMinutes = deckStepsValues[currentCardProgress.steps];
    let ease = currentCardDeck.startingEase;

    if (currentCardProgress.steps > 2) {
      addMinutes = deckStepsValues[2] * (currentCardProgress.steps - 2) * ease;
    }

  
    currentCardProgress.nextRevision = add(currentDate, {
      minutes: addMinutes,
    });

    
    try {
      await em.persistAndFlush(currentCardProgress);
    } catch (err) {
      console.log(err);
    }

    return currentCardProgress.nextRevision.toUTCString();
  }
}
