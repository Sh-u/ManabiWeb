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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
const CardProgress_1 = require("./CardProgress");
const Deck_1 = require("./Deck");
let User = User_1 = class User {
    constructor() {
        this.decks = new core_1.Collection(this);
        this.cardProgresses = new core_1.Collection(this);
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.followers = new core_1.Collection(this);
        this.following = new core_1.Collection(this);
        this.badge = "New";
        this.dayStreak = 0;
        this.cardStudied = 0;
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], User.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Deck_1.Deck]),
    (0, core_1.OneToMany)(() => Deck_1.Deck, (deck) => deck.user, { orphanRemoval: true }),
    __metadata("design:type", Object)
], User.prototype, "decks", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, core_1.Property)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], User.prototype, "image", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ type: "text", unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [CardProgress_1.CardProgress], { nullable: true }),
    (0, core_1.OneToMany)(() => CardProgress_1.CardProgress, (progress) => progress.user, {
        orphanRemoval: true,
    }),
    __metadata("design:type", Object)
], User.prototype, "cardProgresses", void 0);
__decorate([
    (0, core_1.Property)({ type: "text" }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ type: "text", unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    (0, core_1.Property)({ type: "date" }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    (0, core_1.Property)({ type: "date", onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [User_1]),
    (0, core_1.ManyToMany)({ entity: () => User_1, pivotTable: "follow", joinColumn: "followed_user__id" }),
    __metadata("design:type", Object)
], User.prototype, "followers", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [User_1]),
    (0, core_1.ManyToMany)(() => User_1, (u) => u.followers),
    __metadata("design:type", Object)
], User.prototype, "following", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ type: "text" }),
    __metadata("design:type", String)
], User.prototype, "badge", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, core_1.Property)({}),
    __metadata("design:type", Number)
], User.prototype, "dayStreak", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, core_1.Property)({}),
    __metadata("design:type", Number)
], User.prototype, "cardStudied", void 0);
User = User_1 = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, core_1.Entity)()
], User);
exports.User = User;
//# sourceMappingURL=User.js.map