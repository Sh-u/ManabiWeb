import {
    Collection, Entity, OneToMany, OptionalProps, PrimaryKey, Property
} from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
import { Deck } from "./Deck";

@ObjectType()
@Entity()
export class User {
  [OptionalProps]?: "createdAt" | "updatedAt" | "_id" | "password";
  @Field(() => Int)
  @PrimaryKey()
  _id: Number;

  @Field(() => Deck)
  @OneToMany(() => Deck, (deck) => deck.author)
  decks = new Collection<Deck>(this);

  @Field(() => String)
  @Property({ type: "text", unique: true })
  username!: string;

  @Property({ type: "text" })
  password!: string;

  @Field(() => String)
  @Property({ type: "text", unique: true })
  email!: string;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
