import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql/PostgreSqlDriver";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import "cross-fetch/polyfill";
import express from "express";
import session from "express-session";

import Redis from "ioredis";
import { emit } from "process";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME } from "./constants";
import { Deck } from "./entities/Deck";
import { DeckSubscriber } from "./entities/DeckSubscriber";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import mikroOrmConfig from "./mikro-orm.config";
import { DeckResolver } from "./resolvers/deck";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
import {graphqlUploadExpress} from 'graphql-upload'
const corsOptions = {
  origin: [
    "http://localhost:4000",
    "http://localhost:3000",
    "https://studio.apollographql.com",
  ],
  credentials: true,
};

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);

  // await orm.em.nativeDelete(DeckSubscriber, {});
  // await orm.em.nativeDelete(Post, {});
  // await orm.em.nativeDelete(Deck, {});



  
  await orm.getMigrator().up();

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
      resolvers: [HelloResolver, PostResolver, UserResolver, DeckResolver],
      validate: false,
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


