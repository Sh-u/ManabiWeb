import {
  Entity,
  Property,
  PrimaryKey,
  OptionalProps,
  ManyToOne,
} from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
import { Deck } from "./Deck";


@ObjectType()
@Entity()
export class Post {
  [OptionalProps]?:
    | "createdAt"
    | "updatedAt"
    | "_id"
    | "image"
    | "dictionaryAudio"
    | "userAudio";

  @Field(() => String)
  @Property({ type: "text"})
  sentence!: string;

  @Field(() => String)
  @Property({ type: "text" })
  word!: string;

  @Field(() => Int)

  @PrimaryKey()
  _id: Number;

  @Field(() => String, { nullable: true })
  @Property({ type: "text", nullable: true })
  image?: string;

  @Field(() => String, { nullable: true })
  @Property({ type: "text", nullable: true })
  dictionaryAudio?: string;

  @Field(() => String, { nullable: true })
  @Property({ type: "text", nullable: true })
  userAudio?: string;

  @Field(() => Deck)
  @ManyToOne(() => Deck)
  deck!: Deck;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
