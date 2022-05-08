import { _prod_ } from "./constants";
import { Post } from "./entities/Post";
import {  Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import path from 'path'
import { User } from "./entities/User";

export default {
    entities: [Post, User],
    dbName: 'shuddit',
    type: 'postgresql',
    debug: !_prod_,
    user: 'postgres',
    password: 'kapi99',
    migrations:  {
        path: path.join(__dirname, "./migrations"),
        glob: '!(*.d).{js,ts}' 
    },
    allowGlobalContext: true
} as Options<PostgreSqlDriver>



    