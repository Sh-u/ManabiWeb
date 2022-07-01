"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const Card_1 = require("./entities/Card");
const path_1 = __importDefault(require("path"));
const User_1 = require("./entities/User");
const Deck_1 = require("./entities/Deck");
const DeckSubscriber_1 = require("./entities/DeckSubscriber");
const CardProgress_1 = require("./entities/CardProgress");
const PitchAccent_1 = require("./entities/PitchAccent");
exports.default = {
    entities: [Card_1.Card, User_1.User, Deck_1.Deck, DeckSubscriber_1.DeckSubscriber, CardProgress_1.CardProgress, PitchAccent_1.PitchAccent],
    dbName: 'shuddit',
    type: 'postgresql',
    debug: !constants_1._prod_,
    user: 'postgres',
    password: 'kapi99',
    migrations: {
        path: path_1.default.join(__dirname, "./migrations"),
        glob: '!(*.d).{js,ts}'
    },
    allowGlobalContext: true,
    forceUtcTimezone: true
};
//# sourceMappingURL=mikro-orm.config.js.map