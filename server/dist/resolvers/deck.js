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
const Post_1 = require("../entities/Post");
const type_graphql_1 = require("type-graphql");
const Deck_1 = require("../entities/Deck");
const User_1 = require("../entities/User");
let DeckResolver = class DeckResolver {
    async posts({ em }) {
        return em.find(Post_1.Post, {});
    }
    post(_id, { em }) {
        return em.findOne(Deck_1.Deck, { _id });
    }
    async createPost(title, { em, req }) {
        const user = await em.findOne(User_1.User, { _id: req.session.userId });
        const deck = await em.create(Deck_1.Deck, { title, author: user });
        await em.persistAndFlush(deck);
        return deck;
    }
    async updatePostTitle(_id, title, { em }) {
        const post = await em.findOne(Deck_1.Deck, { _id });
        if (!post) {
            return null;
        }
        post.title = title;
        await em.persistAndFlush(post);
        return post;
    }
    async removePost(_id, { em }) {
        const post = await em.findOne(Deck_1.Deck, { _id });
        if (!post) {
            return false;
        }
        await em.removeAndFlush(post);
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Deck_1.Deck]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeckResolver.prototype, "posts", null);
__decorate([
    (0, type_graphql_1.Query)(() => Deck_1.Deck, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("_id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DeckResolver.prototype, "post", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Deck_1.Deck),
    __param(0, (0, type_graphql_1.Arg)("title")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DeckResolver.prototype, "createPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Deck_1.Deck, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("_id")),
    __param(1, (0, type_graphql_1.Arg)("title", () => String, { nullable: true })),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], DeckResolver.prototype, "updatePostTitle", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("_id")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DeckResolver.prototype, "removePost", null);
DeckResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], DeckResolver);
exports.DeckResolver = DeckResolver;
//# sourceMappingURL=deck.js.map