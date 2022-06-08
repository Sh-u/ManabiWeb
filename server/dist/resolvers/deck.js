"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeckResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Deck_1 = require("../entities/Deck");
const User_1 = require("../entities/User");
let DeckResponse = class DeckResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], DeckResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Deck_1.Deck], { nullable: true }),
    __metadata("design:type", Array)
], DeckResponse.prototype, "decks", void 0);
DeckResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], DeckResponse);
let DeckResolver = class DeckResolver {
    async getAllDecks({ em }) {
        return await em.find(Deck_1.Deck, {});
    }
    async getMyDecks({ req, em }) {
        const user = await em.findOne(User_1.User, { _id: req.session.userId });
        if (!user) {
            return {
                errors: "user not found",
            };
        }
        const ownerDecks = await em.find(Deck_1.Deck, { user: user });
        const subscriberDecks = await em.find(Deck_1.Deck, {
            subscribers: { _id: user._id },
        });
        if (!ownerDecks) {
            return {
                errors: "No decks found",
            };
        }
        if (!subscriberDecks) {
            return {
                errors: "No subscribers decks found",
            };
        }
        if (ownerDecks.length < 1) {
            return {
                errors: "Looks like you have no decks created...",
            };
        }
        console.log("success getting decks");
        return {
            decks: [...ownerDecks, ...subscriberDecks],
        };
    }
    async findDeck(_id, { em }) {
        const deck = await em.findOne(Deck_1.Deck, { _id });
        if (!deck) {
            return {
                errors: "Couldn't find the deck you searched for",
            };
        }
        const user = await em.findOne(User_1.User, { _id: deck === null || deck === void 0 ? void 0 : deck.user._id });
        if (!user) {
            return {
                errors: "Couldn't find the user owning this deck",
            };
        }
        return {
            decks: [deck],
        };
    }
    async createDeck(title, { em, req }) {
        const user = await em.findOne(User_1.User, { _id: req.session.userId });
        if (title.length < 4 || title.length > 30) {
            return {
                errors: "Invalid title length",
            };
        }
        if (!user) {
            return {
                errors: "Cannot Create Deck: USER NOT FOUND",
            };
        }
        const deck = await em.create(Deck_1.Deck, { title, user: user });
        try {
            await em.persistAndFlush(deck);
        }
        catch (err) {
            console.log(err);
        }
        return {
            decks: [deck],
        };
    }
    async subscribeToDeck(deckId, { em, req }) {
        const currentUser = await em.findOne(User_1.User, { _id: req.session.userId });
        if (!currentUser) {
            return {
                errors: "Cannot subscribe to deck: User not found",
            };
        }
        const deck = await em.findOne(Deck_1.Deck, { _id: deckId });
        if (!deck) {
            return {
                errors: "Cannot subscribe to deck: Deck not found",
            };
        }
        console.log("subs:    ", deck.subscribers.toArray());
        if (deck.subscribers.toArray().some((user) => user._id === currentUser._id)) {
            return {
                errors: "You are already subscribed to this deck",
            };
        }
        await deck.subscribers.add(currentUser);
        try {
            await em.persistAndFlush(deck);
        }
        catch (err) {
            console.log(err);
        }
        return {
            decks: [deck],
        };
    }
    async unsubscribeToDeck(deckId, { em, req }) {
        const currentUser = await em.findOne(User_1.User, { _id: req.session.userId });
        if (!currentUser) {
            console.log("unsubscribeToDeck error: user not found");
            return false;
        }
        const deck = await em.findOne(Deck_1.Deck, { _id: deckId });
        if (!deck) {
            console.log("unsubscribeToDeck error: deck not found");
            return false;
        }
        console.log(deck);
        if (!deck.subscribers.isInitialized()) {
            await deck.subscribers.init();
            console.log("unitialized");
            return false;
        }
        if (!deck.subscribers.getItems().some((user) => user._id === currentUser._id)) {
            console.log("unsubscribeToDeck error: user not found on the deck");
            return false;
        }
        console.log('removing');
        await deck.subscribers.remove(currentUser);
        try {
            await em.persistAndFlush(deck);
        }
        catch (err) {
            console.log(err);
        }
        return true;
    }
    async renameDeck(_id, title, { em }) {
        if (title.length < 3) {
            return null;
        }
        const deck = await em.findOne(Deck_1.Deck, { _id });
        if (!deck) {
            return null;
        }
        deck.title = title;
        await em.persistAndFlush(deck);
        return deck;
    }
    async deleteDeck(_id, { em }) {
        const deck = await em.findOne(Deck_1.Deck, { _id });
        if (!deck) {
            return false;
        }
        await em.removeAndFlush(deck);
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Deck_1.Deck]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeckResolver.prototype, "getAllDecks", null);
__decorate([
    (0, type_graphql_1.Query)(() => DeckResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeckResolver.prototype, "getMyDecks", null);
__decorate([
    (0, type_graphql_1.Query)(() => DeckResponse),
    __param(0, (0, type_graphql_1.Arg)("_id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DeckResolver.prototype, "findDeck", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => DeckResponse),
    __param(0, (0, type_graphql_1.Arg)("title")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DeckResolver.prototype, "createDeck", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => DeckResponse),
    __param(0, (0, type_graphql_1.Arg)("deckId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DeckResolver.prototype, "subscribeToDeck", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("deckId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DeckResolver.prototype, "unsubscribeToDeck", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Deck_1.Deck, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("_id")),
    __param(1, (0, type_graphql_1.Arg)("title", () => String)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], DeckResolver.prototype, "renameDeck", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("_id")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DeckResolver.prototype, "deleteDeck", null);
DeckResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], DeckResolver);
exports.DeckResolver = DeckResolver;
//# sourceMappingURL=deck.js.map