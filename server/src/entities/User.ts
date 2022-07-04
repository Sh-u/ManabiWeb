import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
import { CardProgress } from "./CardProgress";
import { Deck } from "./Deck";
import { Follower } from "./Follower";

@ObjectType()
@Entity()
export class User {
  [OptionalProps]?:
    | "createdAt"
    | "updatedAt"
    | "password"
    | "image"
    | "cardProgress";
    
  @Field(() => Int)
  @PrimaryKey()
  _id!: Number;

  @Field(() => [Deck])
  @OneToMany(() => Deck, (deck) => deck.user, { orphanRemoval: true })
  decks = new Collection<Deck>(this);

  @Field(() => String, { nullable: true })
  @Property({ type: "text", nullable: true })
  image?: string;

  @Field(() => String)
  @Property({ type: "text", unique: true })
  username!: string;

  @Field(() => [CardProgress], { nullable: true })
  @OneToMany(() => CardProgress, (progress) => progress.user, { orphanRemoval: true }, )
  cardProgresses = new Collection<CardProgress>(this);

  @Property({ type: "text" })
  password!: string;

  @Field(() => String)
  @Property({ type: "text", unique: true })
  email!: string;

  @Field(() => Date)
  @Property({ type: "date" })
  createdAt: Date = new Date();

  @Field(() => Date)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt: Date = new Date();


  @Field(() => [User], {nullable: true})
  @ManyToMany({ entity: () => User, pivotEntity: () => Follower, nullable: true})
  followers = new Collection<User>(this);
}
