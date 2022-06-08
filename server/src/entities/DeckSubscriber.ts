import { Entity, ManyToOne, OneToOne, PrimaryKey } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
import { Deck } from "./Deck";
import { User } from "./User";

@ObjectType()
@Entity()
export class DeckSubscriber {
  @Field(() => Int)
  @PrimaryKey()
  _id: Number;

  @Field(() => User)
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Deck)
  deck: Deck;
}
