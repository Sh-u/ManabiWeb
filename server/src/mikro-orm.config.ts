import { _prod_ } from "./constants";
import { Card } from "./entities/Card";
import {  Options } from "@mikro-orm/core";
import { PostgreSqlDriver, EntityManager } from "@mikro-orm/postgresql";
import path from 'path'
import { User } from "./entities/User";
import { Deck } from "./entities/Deck";
import { DeckSubscriber } from "./entities/DeckSubscriber";
import { CardProgress } from "./entities/CardProgress";
import { PitchAccent } from "./entities/PitchAccent";

export default {
    entities: [Card, User, Deck, DeckSubscriber, CardProgress, PitchAccent],
    dbName: 'shuddit',
    type: 'postgresql',
    debug: !_prod_,
    user: 'postgres',
    password: 'kapi99',
    migrations:  {
        path: path.join(__dirname, "./migrations"),
        glob: '!(*.d).{js,ts}' 
    },
    allowGlobalContext: true,
    forceUtcTimezone: true
} as Options<PostgreSqlDriver>



    