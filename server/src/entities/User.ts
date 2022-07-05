import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
import { CardProgress } from "./CardProgress";
import { Deck } from "./Deck";

export type BadgeType = "New" | "Improving" | "Scholar" | "Card Master";

@ObjectType()
@Entity()
export class User {
  [OptionalProps]?:
    | "createdAt"
    | "updatedAt"
    | "password"
    | "image"
    | "cardProgress"
    | "badge"
    | "dayStreak"
    | "cardsStudied"
    | "followers"
    | "following";

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
  @OneToMany(() => CardProgress, (progress) => progress.user, {
    orphanRemoval: true,
  })
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

  @Field(() => [User])
  @ManyToMany({ entity: () => User, pivotTable: "follow", joinColumn: "followed_user__id" })
  followers = new Collection<User>(this);


  @Field(() => [User])
  @ManyToMany(() => User, (u) => u.followers)
  following = new Collection<User>(this);

  
  @Field(() => String)
  @Property({ type: "text" })
  badge?: BadgeType = "New";

  @Field(() => Int)
  @Property({})
  dayStreak?: number = 0;

  @Field(() => Int)
  @Property({})
  cardStudied?: number = 0;
}
