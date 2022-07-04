import { Entity, ManyToMany, ManyToOne, PrimaryKey } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class Follower {
  @Field(() => Int)
  @PrimaryKey()
  _id!: number;

  @Field(() => User)
  @ManyToMany()
  user: User;
}
