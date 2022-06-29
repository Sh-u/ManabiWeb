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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardProgressResolver = void 0;
const Card_1 = require("../entities/Card");
const type_graphql_1 = require("type-graphql");
const CardProgress_1 = require("../entities/CardProgress");
const add_1 = __importDefault(require("date-fns/add"));
const Deck_1 = require("../entities/Deck");
let RevisionTimeResponse = class RevisionTimeResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], RevisionTimeResponse.prototype, "AGAIN", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], RevisionTimeResponse.prototype, "GOOD", void 0);
RevisionTimeResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], RevisionTimeResponse);
let CardProgressResolver = class CardProgressResolver {
    async getRevisionTime(currentCardId, { em }) {
        console.log("revision");
        const card = await em.findOne(Card_1.Card, { _id: currentCardId });
        if (!card) {
            return {
                AGAIN: null,
                GOOD: null,
            };
        }
        const currentCardProgress = await em.findOne(CardProgress_1.CardProgress, {
            card: card,
        });
        if (!currentCardProgress) {
            return {
                AGAIN: null,
                GOOD: null,
            };
        }
        const deckSteps = card.deck.steps;
        const ease = card.deck.startingEase;
        const cardSteps = card.cardProgresses[0].steps;
        let goodNumber = null;
        let againNumber = null;
        let goodResult = null;
        let againResult = null;
        console.log("steps", cardSteps);
        if (cardSteps === 2) {
            goodNumber = deckSteps[2] * ease;
            console.log("res good", goodNumber);
        }
        else if (cardSteps > 2) {
            goodNumber = deckSteps[2] * (currentCardProgress.steps - 2) * ease;
        }
        else {
            goodNumber = deckSteps[cardSteps + 1];
            if (goodNumber < 1440) {
                goodResult = `${goodNumber} m`;
            }
        }
        if (goodNumber >= 1440) {
            const days = Math.floor(goodNumber / 1440);
            const leftoverMinutes = goodNumber % 1440;
            goodResult = `${days} day/s, ${leftoverMinutes} m`;
        }
        againNumber = deckSteps[0];
        againResult = `${againNumber} m`;
        console.log(goodNumber);
        return {
            GOOD: goodResult,
            AGAIN: againResult,
        };
    }
    async getCardProgresses({ em }) {
        const progress = await em.find(CardProgress_1.CardProgress, {});
        if (!progress) {
            return null;
        }
        return progress;
    }
    async chooseCardDifficulty(currentCardId, answerType, { em }) {
        const currentCard = await em.findOne(Card_1.Card, { _id: currentCardId }, { populate: ["cardProgresses"] });
        if (!currentCard) {
            return null;
        }
        const currentCardProgress = await em.findOne(CardProgress_1.CardProgress, {
            card: currentCard,
        });
        if (!currentCardProgress) {
            return null;
        }
        const currentDate = new Date();
        const currentCardDeck = await em.findOne(Deck_1.Deck, {
            _id: currentCard.deck._id,
        });
        if (!currentCardDeck)
            return null;
        let addMinutes;
        const deckStepsValues = currentCardDeck.steps;
        if (answerType === "GOOD") {
            currentCardProgress.steps++;
        }
        else if (answerType === "AGAIN") {
            currentCardProgress.steps = 0;
        }
        currentCardProgress.steps > 2
            ? (currentCardProgress.state = "Review")
            : (currentCardProgress.state = "Learn");
        addMinutes = deckStepsValues[currentCardProgress.steps];
        let ease = currentCardDeck.startingEase;
        if (currentCardProgress.steps > 2) {
            addMinutes = deckStepsValues[2] * (currentCardProgress.steps - 2) * ease;
        }
        currentCardProgress.nextRevision = (0, add_1.default)(currentDate, {
            minutes: addMinutes,
        });
        try {
            await em.persistAndFlush(currentCardProgress);
        }
        catch (err) {
            console.log(err);
        }
        return currentCardProgress.nextRevision.toUTCString();
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => RevisionTimeResponse),
    __param(0, (0, type_graphql_1.Arg)("currentCardId", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CardProgressResolver.prototype, "getRevisionTime", null);
__decorate([
    (0, type_graphql_1.Query)(() => [CardProgress_1.CardProgress], { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CardProgressResolver.prototype, "getCardProgresses", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("currentCardId", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("answerType")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], CardProgressResolver.prototype, "chooseCardDifficulty", null);
CardProgressResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CardProgressResolver);
exports.CardProgressResolver = CardProgressResolver;
//# sourceMappingURL=cardProgress.js.map