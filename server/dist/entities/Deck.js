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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deck = void 0;
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
const DeckSubscriber_1 = require("./DeckSubscriber");
const Post_1 = require("./Post");
const User_1 = require("./User");
let Deck = class Deck {
    constructor() {
        this.subscribers = new core_1.Collection(this);
        this.posts = new core_1.Collection(this);
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ type: "text" }),
    __metadata("design:type", String)
], Deck.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User),
    (0, core_1.ManyToOne)(() => User_1.User),
    __metadata("design:type", User_1.User)
], Deck.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [DeckSubscriber_1.DeckSubscriber]),
    (0, core_1.ManyToMany)({ entity: () => User_1.User, pivotEntity: () => DeckSubscriber_1.DeckSubscriber }),
    __metadata("design:type", Object)
], Deck.prototype, "subscribers", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Deck.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Post_1.Post]),
    (0, core_1.OneToMany)(() => Post_1.Post, (post) => post.deck),
    __metadata("design:type", core_1.Collection)
], Deck.prototype, "posts", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ type: "date" }),
    __metadata("design:type", Date)
], Deck.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ type: "date", onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], Deck.prototype, "updatedAt", void 0);
Deck = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, core_1.Entity)()
], Deck);
exports.Deck = Deck;
//# sourceMappingURL=Deck.js.map