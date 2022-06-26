import { Card } from "../entities/Card";
import { MyContext } from "src/types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { CardProgress } from "../entities/CardProgress";
import { compareAsc, format } from "date-fns";
import add from "date-fns/add";

type AnswerType = "GOOD" | "AGAIN";

@Resolver()
export class CardProgressResolver {
  @Query(() => Int)
  async getRevisionTime(
    @Arg("currentCardId", () => Int) currentCardId: number,
    @Ctx() { em }: MyContext
  ): Promise<number | null> {

    const card = await em.findOne(Card, {_id: currentCardId})

    if (!card){
      return null;
    }


    const currentCardProgress = await em.findOne(CardProgress, {
      card: card,
    });

    if (!currentCardProgress) {
      return null;
    }


    const deckSteps = card.deck.steps
    const ease = card.deck.startingEase;
    const cardSteps = card.cardProgresses[0].steps;

    if (cardSteps > 2){
      return deckSteps[cardSteps-2] * ease;
    }
    

    return deckSteps[cardSteps];
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

  @Mutation(() => Boolean)
  async chooseCardDifficulty(
    @Arg("currentCardId", () => Int) currentCardId: number,
    @Arg("answerType") answerType: AnswerType,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    const currentCard = await em.findOne(
      Card,
      { _id: currentCardId },
      { populate: ["cardProgresses"] }
    );

    if (!currentCard) {
      return false;
    }

    const currentCardProgress = await em.findOne(CardProgress, {
      card: currentCard,
    });

    if (!currentCardProgress) {
      return false;
    }
    let addMinutes;
    const deckStepsValues = currentCard.deck.steps;
    console.log("deckStepsValues", deckStepsValues);

    if (answerType === "GOOD") {
      if (currentCardProgress.steps < 3) {
        currentCardProgress.steps++;
      }

      currentCardProgress.steps > 2
        ? (currentCardProgress.state = "Review")
        : (currentCardProgress.state = "Learn");
    } else if (answerType === "AGAIN") {
      if (currentCardProgress.steps > 0) {
        currentCardProgress.steps--;
      }

      currentCardProgress.steps > 2
        ? (currentCardProgress.state = "Review")
        : (currentCardProgress.state = "Learn");
    }

    addMinutes = deckStepsValues[currentCardProgress.steps];
    let ease = currentCard.deck.startingEase;
    if (currentCardProgress.steps > 2) {
      addMinutes = deckStepsValues[2] * (currentCardProgress.steps - 2) * ease;
    }

    const currentDate = new Date();

    currentCardProgress.nextRevision = add(currentDate, {
      minutes: addMinutes,
    });

    try {
      await em.persistAndFlush(currentCardProgress);
    } catch (err) {
      console.log(err);
    }

    return true;
  }
}
