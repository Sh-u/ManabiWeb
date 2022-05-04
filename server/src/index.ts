import { MikroORM } from "@mikro-orm/core";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import "cross-fetch/polyfill";
import express from "express";
import session from "express-session";
import { createClient } from "redis";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME } from "./constants";
import { User } from "./entities/User";
import mikroOrmConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
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
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.em.nativeDelete(User, {});
  await orm.getMigrator().up();

  const app = express();

  app.set("trust proxy", process.env.NODE_ENV !== "production");
  app.set("Access-Control-Allow-Origin", "https://studio.apollographql.com");
  app.set("Access-Control-Allow-Credentials", true);

  const RedisStore = connectRedis(session);
  const redisClient = createClient({ legacyMode: true });
  redisClient.connect().catch(console.error);

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
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
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),

    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: { "request.credentials": "include" },
      }),
    ],
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
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

console.log("lole");
