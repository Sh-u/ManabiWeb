import {
  Property,
  ManyToOne,
  Entity,
  PrimaryKey,
  OneToOne,
  OptionalProps,
} from "@mikro-orm/core";
import { parseType } from "graphql";
import { PitchTypes } from "../types";
import { ObjectType, Field, Int } from "type-graphql";
import { Card } from "./Card";

@ObjectType()
@Entity()
export class PitchAccent {
  [OptionalProps]?: "part" | "high";

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

  // @Field(() => [String], { nullable: true })
  // @Property({ nullable: true })
  // part? = [];

  // @Field(() => [Boolean], { nullable: true })
  // @Property({ nullable: true })
  // high? = [];

  @Field(() => Card)
  @ManyToOne(() => Card)
  card!: Card;
}
