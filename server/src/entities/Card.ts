import {
  Entity,
  Property,
  PrimaryKey,
  OptionalProps,
  ManyToOne,
  OneToMany,
  Collection,
  ManyToMany,
  OneToOne,
} from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
import { Deck } from "./Deck";

import { CardProgress } from "./CardProgress";
import { PitchAccent } from "./PitchAccent";


@ObjectType()
@Entity()
export class Card {
  [OptionalProps]?:
    | "createdAt"
    | "updatedAt"
    | "image"
    | "dictionaryAudio"
    | "dictionaryMeaning"
    | "userAudio"
    | "pitchAccent"
    | "furigana"


  @Field(() => Int)
  @PrimaryKey()
  _id!: Number;

  @Field(() => String)
  @Property({ type: "text" })
  sentence!: string;

  @Field(() => String)
  @Property({ type: "text" })
  word!: string;

  @Field(() => String, { nullable: true })
  @Property({ type: "text", nullable: true })
  furigana?: string;


  @Field(() => [CardProgress])
  @OneToMany(() => CardProgress, (cardProgress) => cardProgress.card)
  cardProgresses = new Collection<CardProgress>(this);

  @Field(() => String, { nullable: true })
  @Property({ type: "text", nullable: true })
  image?: string;

  @Field(() => [String], { nullable: true })
  @Property({ nullable: true })
  dictionaryMeaning?: string[];

  @Field(() => String, { nullable: true })
  @Property({ type: "text", nullable: true })
  dictionaryAudio?: string;

  @Field(() => [PitchAccent], { nullable: true })
  @OneToMany(() => PitchAccent, accent => accent.card, {nullable: true})
  pitchAccent? = new Collection<PitchAccent>(this);

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
