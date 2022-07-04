import {
  Property,
  ManyToOne,
  Entity,
  PrimaryKey,
  OneToOne,
  OptionalProps,
} from "@mikro-orm/core";
import { parseType } from "graphql";
import { ObjectType, Field, Int } from "type-graphql";
import { Card } from "./Card";

type PitchTypes = "atamadaka" | "nakadaka" | "odaka" | "heiban" | null

@ObjectType()
@Entity()
export class PitchAccent {
  [OptionalProps]?: "part" | "high";

  @Field(() => String,  {nullable: true})
  @Property( {nullable: true})
  descriptive: PitchTypes = null;

  @Field(() => Int, {nullable: true})
  @Property({nullable: true})
  mora: number | null = null;

  @Field(() => Int)
  @PrimaryKey()
  _id!: Number;

  @Field(() => [String])
  @Property()
  part? = [];

  @Field(() => [Boolean])
  @Property()
  high? = [];

  @Field(() => Card)
  @ManyToOne(() => Card)
  card!: Card;
}
