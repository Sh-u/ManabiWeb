import { Property, ManyToOne, Entity, PrimaryKey, OneToOne } from "@mikro-orm/core";
import { parseType } from "graphql";
import { ObjectType, Field, Int } from "type-graphql";
import { Card } from "./Card";

@ObjectType()
@Entity()
export class PitchAccent {

  @Field(() => Int)
  @PrimaryKey()
  _id!: Number;

  @Field(() => [String])
  @Property()
  part = [];

  @Field(() => [Boolean])
  @Property()
  high = [];

  @Field(() => Card)
  @OneToOne(() => Card)
  card: Card;
}
