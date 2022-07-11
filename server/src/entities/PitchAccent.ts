import {
  Property,
  ManyToOne,
  Entity,
  PrimaryKey,
  OneToOne,
  OptionalProps,
  ArrayType,
  types,
} from "@mikro-orm/core";
import { parseType } from "graphql";
import { PitchTypes } from "../types";
import { ObjectType, Field, Int } from "type-graphql";
import { Card } from "./Card";

@ObjectType()
@Entity()
export class PitchAccent {
  @Field(() => String, { nullable: true })
  @Property({ type: "text", nullable: true })
  descriptive: PitchTypes | null = null;

  @Field(() => Int, { nullable: true })
  @Property({ type: "integer", nullable: true })
  mora: number | null = null;

  @Field(() => Int)
  @PrimaryKey()
  _id!: Number;

  @Field(() => String, { nullable: true })
  @Property({ type: "text", nullable: true })
  word?: string | null;

  @Field(() => String, { nullable: true })
  @Property({ type: "text", nullable: true })
  kana?: string | null;

  @Field(() => Boolean, { nullable: true })
  @Property({ nullable: true })
  showKana?: boolean;

  @Field(() => [String], { nullable: true })
  @Property({ nullable: true })
  part: string[];

  @Field(() => String, { nullable: true })
  @Property({
    type: "jsonb",
    nullable: true,
  })
  high: string;

  @Field(() => Card)
  @ManyToOne(() => Card)
  card!: Card;
}
