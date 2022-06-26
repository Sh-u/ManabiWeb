import {
  Entity,
  Property,
  PrimaryKey,
  OptionalProps,
  ManyToOne,
  OneToMany,
  Collection,
  ManyToMany,
  Filter,
  Cascade,
  OneToOne,
} from "@mikro-orm/core";
import { Field, Float, Int, ObjectType } from "type-graphql";
import { DeckSubscriber } from "./DeckSubscriber";
import { Card } from "./Card";
import { User } from "./User";
import { type } from "os";
import { CardProgress } from "./CardProgress";

@ObjectType()
@Entity()
export class Deck {
  [OptionalProps]?:
    | "createdAt"
    | "updatedAt"
    | "cards"
    | "japaneseTemplate"
    | "steps"
    | "graduatingInterval"
    | "startingEase"
    | "cardProgress"

  @Field(() => Int)
  @PrimaryKey()
  _id!: Number;

  @Field(() => String)
  @Property({ type: "text" })
  title!: string;

  @Field(() => User)
  @ManyToOne(() => User)
  user!: User;

  @Field(() => Boolean, { nullable: true })
  @Property({ nullable: true })
  japaneseTemplate?: boolean;

  @Field(() => [DeckSubscriber])
  @ManyToMany({ entity: () => User, pivotEntity: () => DeckSubscriber })
  subscribers = new Collection<User>(this);

  @Field(() => [Int])
  @Property()
  steps: Array<number> = [1, 10, 1400];

  @Field(() => Int)
  @Property()
  graduatingInterval: number = 1;

  @Field(() => Float)
  @Property()
  startingEase: number = 2.5;

  @Field(() => [Card])
  @OneToMany(() => Card, (card) => card.deck)
  cards: Collection<Card> = new Collection<Card>(this);

  @Field(() => String)
  @Property({ type: "date" })
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
