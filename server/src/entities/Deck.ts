import { Entity, Property, PrimaryKey, OptionalProps, ManyToOne } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
import { Post } from "./Post";
import { User } from "./User";

@ObjectType()
@Entity()
export class Deck {
    [OptionalProps]?: 'createdAt' | 'updatedAt' | '_id' | 'posts'

    @Field(() => String)
    @Property({type: 'text'})
    title!: string;

    @Field(() => User)
    @ManyToOne()
    author!: User;


    @Field(() => Int)
    @PrimaryKey()
    _id: Number;

    @Field(() => [Post], {nullable: true})
    @Property({nullable: true})
    posts: Post[];

    @Field(() => String)
    @Property({type: 'date'})
    createdAt: Date = new Date();

    @Field(() => String)
    @Property({type: 'date', onUpdate: () => new Date() })
    updatedAt: Date = new Date();

}