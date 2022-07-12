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
exports.PitchAccent = void 0;
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
const Card_1 = require("./Card");
let PitchAccent = class PitchAccent {
    constructor() {
        this.descriptive = null;
        this.mora = null;
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, core_1.Property)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], PitchAccent.prototype, "descriptive", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    (0, core_1.Property)({ type: "integer", nullable: true }),
    __metadata("design:type", Object)
], PitchAccent.prototype, "mora", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], PitchAccent.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, core_1.Property)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], PitchAccent.prototype, "word", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, core_1.Property)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], PitchAccent.prototype, "kana", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Boolean)
], PitchAccent.prototype, "showKana", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Array)
], PitchAccent.prototype, "part", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Boolean], { nullable: true }),
    (0, core_1.Property)({
        type: core_1.JsonType,
        nullable: true,
    }),
    __metadata("design:type", Array)
], PitchAccent.prototype, "high", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Card_1.Card),
    (0, core_1.ManyToOne)(() => Card_1.Card),
    __metadata("design:type", Card_1.Card)
], PitchAccent.prototype, "card", void 0);
PitchAccent = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, core_1.Entity)()
], PitchAccent);
exports.PitchAccent = PitchAccent;
//# sourceMappingURL=PitchAccent.js.map