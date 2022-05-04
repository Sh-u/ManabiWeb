import { Entity, Property, PrimaryKey, OptionalProps } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
    [OptionalProps]?: 'createdAt' | 'updatedAt' | '_id' | 'password'
    @Field(() => Int)
    @PrimaryKey()
    _id: Number;


    @Field(() => String)
    @Property({type: 'text', unique: true})
    username!: string;

    
    @Property({type: 'text'})
    password!: string;

    @Field(()  => String)
    @Property({type: 'text', unique: true})
    email!:  string;

    @Field(() => String)
    @Property({type: 'date'})
    createdAt: Date = new Date();

    @Field(() => String)
    @Property({type: 'date', onUpdate: () => new Date() })
    updatedAt: Date = new Date();

}