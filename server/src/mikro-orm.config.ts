import path from "path";
import { _prod_ } from "./constants";
import { Card } from "./entities/Card";
import { CardProgress } from "./entities/CardProgress";
import { Deck } from "./entities/Deck";
import { DeckSubscriber } from "./entities/DeckSubscriber";

import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { PitchAccent } from "./entities/PitchAccent";
import { User } from "./entities/User";

export default {
  driver: PostgreSqlDriver,
  entities: [
    Card,
    User,
    Deck,
    DeckSubscriber,
    CardProgress,
    PitchAccent,

  ],
  dbName: "shuddit",
  type: "postgresql",
  debug: !_prod_,
  user: "postgres",
  password: "kapi99",
  migrations: {
    path: path.join(__dirname, "./migrations"),
    glob: "!(*.d).{js,ts}",
  },
  allowGlobalContext: true,
  forceUtcTimezone: true,
} as const
