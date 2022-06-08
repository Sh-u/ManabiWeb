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
exports.DeckSubscriber = void 0;
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
const Deck_1 = require("./Deck");
const User_1 = require("./User");
let DeckSubscriber = class DeckSubscriber {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], DeckSubscriber.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User),
    (0, core_1.ManyToOne)(() => User_1.User),
    __metadata("design:type", User_1.User)
], DeckSubscriber.prototype, "user", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => Deck_1.Deck),
    __metadata("design:type", Deck_1.Deck)
], DeckSubscriber.prototype, "deck", void 0);
DeckSubscriber = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, core_1.Entity)()
], DeckSubscriber);
exports.DeckSubscriber = DeckSubscriber;
//# sourceMappingURL=DeckSubscriber.js.map