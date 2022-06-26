import { Entity, ManyToOne, OneToOne, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
import { Card } from "./Card";
import { Deck } from "./Deck";
import { User } from "./User";

type CardState =  "Learn" | "Review"

@ObjectType()
@Entity()
export class CardProgress {

  [OptionalProps]?:
  | "createdAt"
  | "updatedAt"
  | "nextRevision"
  | "steps"
  | "state";

  
  @Field(() => Int)
  @PrimaryKey()
  _id!: Number;

  @Field(() => User)
  @ManyToOne( () => User)
  user!: User;

  @Field(() => Card)
  @ManyToOne(() => Card)
  card!: Card;

  @Field(() => String)
  @Property()
  state: CardState = "Learn";

  @Field(() => Int)
  @Property()
  steps: number = 0;


  @Field(() => Date)
  @Property({ type: "date" })
  nextRevision: Date = new Date();

  @Field(() => Date)
  @Property({ type: "date" })
  createdAt: Date = new Date();

  @Field(() => Date)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
