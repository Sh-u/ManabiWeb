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
exports.CardProgress = void 0;
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
const Card_1 = require("./Card");
const User_1 = require("./User");
let CardProgress = class CardProgress {
    constructor() {
        this.state = "Learn";
        this.steps = 0;
        this.nextRevision = new Date();
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], CardProgress.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User),
    (0, core_1.ManyToOne)(() => User_1.User),
    __metadata("design:type", User_1.User)
], CardProgress.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Card_1.Card),
    (0, core_1.ManyToOne)(() => Card_1.Card),
    __metadata("design:type", Card_1.Card)
], CardProgress.prototype, "card", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], CardProgress.prototype, "state", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], CardProgress.prototype, "steps", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    (0, core_1.Property)({ type: "date" }),
    __metadata("design:type", Date)
], CardProgress.prototype, "nextRevision", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    (0, core_1.Property)({ type: "date" }),
    __metadata("design:type", Date)
], CardProgress.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    (0, core_1.Property)({ type: "date", onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], CardProgress.prototype, "updatedAt", void 0);
CardProgress = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, core_1.Entity)()
], CardProgress);
exports.CardProgress = CardProgress;
//# sourceMappingURL=CardProgress.js.map