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
exports.Card = void 0;
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
const Deck_1 = require("./Deck");
const CardProgress_1 = require("./CardProgress");
let Card = class Card {
    constructor() {
        this.cardProgresses = new core_1.Collection(this);
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Card.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ type: "text" }),
    __metadata("design:type", String)
], Card.prototype, "sentence", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ type: "text" }),
    __metadata("design:type", String)
], Card.prototype, "word", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [CardProgress_1.CardProgress]),
    (0, core_1.OneToMany)(() => CardProgress_1.CardProgress, (cardProgress) => cardProgress.card),
    __metadata("design:type", Object)
], Card.prototype, "cardProgresses", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, core_1.Property)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Card.prototype, "image", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, core_1.Property)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Card.prototype, "dictionaryMeaning", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, core_1.Property)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Card.prototype, "dictionaryAudio", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, core_1.Property)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Card.prototype, "userAudio", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Deck_1.Deck),
    (0, core_1.ManyToOne)(() => Deck_1.Deck),
    __metadata("design:type", Deck_1.Deck)
], Card.prototype, "deck", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ type: "date" }),
    __metadata("design:type", Date)
], Card.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ type: "date", onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], Card.prototype, "updatedAt", void 0);
Card = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, core_1.Entity)()
], Card);
exports.Card = Card;
//# sourceMappingURL=Card.js.map