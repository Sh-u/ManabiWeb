import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import "cross-fetch/polyfill";
import express from "express";
import session from "express-session";

import { graphqlUploadExpress } from 'graphql-upload';
import Redis from "ioredis";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME } from "./constants";
import { Card } from "./entities/Card";
import { Deck } from "./entities/Deck";
import { DeckSubscriber } from "./entities/DeckSubscriber";
import mikroOrmConfig from "./mikro-orm.config";
import { CardResolver } from "./resolvers/card";
import { CardProgressResolver } from "./resolvers/cardProgress";
import { DeckResolver } from "./resolvers/deck";
import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
const corsOptions = {
  origin: [
    "http://localhost:4000",
    "http://localhost:3000",
    "https://studio.apollographql.com",
  ],
  credentials: true,
};

const main = async () => {
  // @ts-ignore
  const orm = await MikroORM.init(mikroOrmConfig);

  // await orm.em.nativeDelete(DeckSubscriber, {});
  // await orm.em.nativeDelete(Card, {});
  // await orm.em.nativeDelete(Deck, {});

  
  

  const app = express();

  app.set("trust proxy", process.env.NODE_ENV !== "production");
  app.set("Access-Control-Allow-Origin", "https://studio.apollographql.com");
  app.set("Access-Control-Allow-Credentials", true);

  
  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),

      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      },
      saveUninitialized: false,
      secret: "dudu",
      resave: false,
    }),
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 4 })
  );

  const apolloServer = new ApolloServer({
    
    schema: await buildSchema({
      resolvers: [HelloResolver, CardResolver, UserResolver, DeckResolver, CardProgressResolver],
      validate: false,
      dateScalarMode: "isoDate",
    }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: { "request.credentials": "include" },
      }),
    ],
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res, redis }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: corsOptions });

  app.listen(4000, () => {
    console.log("started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});


