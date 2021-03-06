"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const apollo_server_core_1 = require("apollo-server-core");
const apollo_server_express_1 = require("apollo-server-express");
const connect_redis_1 = __importDefault(require("connect-redis"));
require("cross-fetch/polyfill");
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const graphql_upload_1 = require("graphql-upload");
const ioredis_1 = __importDefault(require("ioredis"));
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const constants_1 = require("./constants");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const card_1 = require("./resolvers/card");
const cardProgress_1 = require("./resolvers/cardProgress");
const deck_1 = require("./resolvers/deck");
const hello_1 = require("./resolvers/hello");
const user_1 = require("./resolvers/user");
const corsOptions = {
    origin: [
        "http://localhost:4000",
        "http://localhost:3000",
        "https://studio.apollographql.com",
    ],
    credentials: true,
};
const main = async () => {
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    const app = (0, express_1.default)();
    app.set("trust proxy", process.env.NODE_ENV !== "production");
    app.set("Access-Control-Allow-Origin", "https://studio.apollographql.com");
    app.set("Access-Control-Allow-Credentials", true);
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redis = new ioredis_1.default();
    app.use((0, express_session_1.default)({
        name: constants_1.COOKIE_NAME,
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
    }), (0, graphql_upload_1.graphqlUploadExpress)({ maxFileSize: 10000000, maxFiles: 4 }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [hello_1.HelloResolver, card_1.CardResolver, user_1.UserResolver, deck_1.DeckResolver, cardProgress_1.CardProgressResolver],
            validate: false,
            dateScalarMode: "isoDate",
        }),
        plugins: [
            (0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)({
                settings: { "request.credentials": "include" },
            }),
        ],
        context: ({ req, res }) => ({ em: orm.em, req, res, redis }),
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
//# sourceMappingURL=index.js.map