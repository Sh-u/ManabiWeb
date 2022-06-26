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
exports.CardResolver = void 0;
const Card_1 = require("../entities/Card");
const type_graphql_1 = require("type-graphql");
const Deck_1 = require("../entities/Deck");
const graphql_upload_1 = require("graphql-upload");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const class_validator_1 = require("class-validator");
const CardProgress_1 = require("../entities/CardProgress");
let CardInput = class CardInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, class_validator_1.Length)(5, 50),
    __metadata("design:type", String)
], CardInput.prototype, "sentence", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, class_validator_1.Length)(5, 15),
    __metadata("design:type", String)
], CardInput.prototype, "word", void 0);
CardInput = __decorate([
    (0, type_graphql_1.InputType)()
], CardInput);
let CardResponse = class CardResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], CardResponse.prototype, "error", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Card_1.Card, { nullable: true }),
    __metadata("design:type", Card_1.Card)
], CardResponse.prototype, "card", void 0);
CardResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], CardResponse);
let CardResolver = class CardResolver {
    async getCards({ em }) {
        return em.find(Card_1.Card, {});
    }
    card(_id, { em }) {
        return em.findOne(Card_1.Card, { _id });
    }
    async createCard(options, deckId, image, audio, { em }) {
        if (options.sentence.length < 1 || options.word.length < 1) {
            return {
                error: "Input is too short",
            };
        }
        const currentDeck = await em.findOne(Deck_1.Deck, { _id: deckId });
        if (!currentDeck) {
            return {
                error: "Couldn't find a current deck in Card/Resolver",
            };
        }
        await em.begin();
        try {
            const card = await em.create(Card_1.Card, {
                sentence: options.sentence,
                word: options.word,
                deck: currentDeck,
            });
            const progress = await em.create(CardProgress_1.CardProgress, { card: card, user: card.deck.user._id, });
            await em.persist(progress);
            try {
                await em.persistAndFlush(card);
            }
            catch (err) {
                console.log(err);
            }
            if (image) {
                console.log("mime", image.mimetype);
                image.filename = `image-${card._id}`;
            }
            if (audio) {
                console.log("mime", audio.mimetype);
                audio.filename = `audio-${card._id}`;
            }
            const basePath = path_1.default.join(`userFiles/user-${currentDeck.user._id}/deck-${currentDeck._id}/card-${card._id}/`);
            const targetPath = path_1.default.resolve("..", "web", "public", basePath);
            await (0, fs_1.mkdir)(targetPath, (err) => {
                return console.log(`error while creating a dir `, err);
            });
            console.log(`basePath: `, basePath);
            console.log(`targetPath: `, targetPath);
            const imgMimes = ["image/jpeg", "image/png", "image/jpg", "image/jpeg"];
            const audioMimes = ["audio/mp3", "audio/wav", "audio/ogg", "audio/mp3"];
            if (image && imgMimes.some((item) => item === image.mimetype)) {
                console.log("writing image");
                await new Promise((resolve, reject) => {
                    image
                        .createReadStream()
                        .pipe((0, fs_1.createWriteStream)(path_1.default.join(targetPath, image.filename)))
                        .on("finish", () => {
                        console.log("finish");
                        resolve(true);
                    })
                        .on("error", () => {
                        console.log("error");
                        reject(false);
                    });
                });
                card.image = path_1.default.join(basePath, image.filename);
            }
            if (audio && audioMimes.some((item) => item === audio.mimetype)) {
                console.log("writing audio");
                await new Promise((resolve, reject) => {
                    audio
                        .createReadStream()
                        .pipe((0, fs_1.createWriteStream)(path_1.default.join(targetPath, audio.filename)))
                        .on("finish", () => {
                        console.log("finish");
                        resolve(true);
                    })
                        .on("error", () => {
                        console.log("error");
                        reject(false);
                    });
                });
                card.userAudio = path_1.default.join(basePath, audio.filename);
            }
            await em.commit();
            return {
                card: card,
            };
        }
        catch (e) {
            await em.rollback();
            throw e;
        }
    }
    async updateCardTitle(_id, { em }) {
        const card = await em.findOne(Card_1.Card, { _id });
        if (!card) {
            return null;
        }
        await em.persistAndFlush(card);
        return card;
    }
    async editCard(targetId, image, audio, options, { em }) {
        if (options.sentence.length < 1 || options.word.length < 1) {
            return {
                error: "Input is too short",
            };
        }
        const card = await em.findOne(Card_1.Card, { _id: targetId });
        if (!card) {
            return {
                error: "Could not find a matching card",
            };
        }
        await em.begin();
        try {
            card.sentence = options.sentence;
            card.word = options.word;
            if (image) {
                console.log("mime", image.mimetype);
                image.filename = `image-${card._id}`;
            }
            if (audio) {
                console.log("mime", audio.mimetype);
                audio.filename = `audio-${card._id}`;
            }
            const basePath = path_1.default.join(`userFiles/user-${card.deck.user._id}/deck-${card.deck._id}/card-${card._id}/`);
            const targetPath = path_1.default.resolve("..", "web", "public", basePath);
            const imgMimes = ["image/jpeg", "image/png", "image/jpg", "image/jpeg"];
            const audioMimes = ["audio/mp3", "audio/wav", "audio/ogg", "audio/mp3"];
            if (image && imgMimes.some((item) => item === image.mimetype)) {
                console.log("writing image");
                await new Promise((resolve, reject) => {
                    image
                        .createReadStream()
                        .pipe((0, fs_1.createWriteStream)(path_1.default.join(targetPath, image.filename)))
                        .on("finish", () => {
                        console.log("finish");
                        resolve(true);
                    })
                        .on("error", () => {
                        console.log("error");
                        reject(false);
                    });
                });
                card.image = path_1.default.join(basePath, image.filename);
            }
            if (audio && audioMimes.some((item) => item === audio.mimetype)) {
                console.log("writing audio");
                await new Promise((resolve, reject) => {
                    audio
                        .createReadStream()
                        .pipe((0, fs_1.createWriteStream)(path_1.default.join(targetPath, audio.filename)))
                        .on("finish", () => {
                        console.log("finish");
                        resolve(true);
                    })
                        .on("error", () => {
                        console.log("error");
                        reject(false);
                    });
                });
                card.userAudio = path_1.default.join(basePath, audio.filename);
            }
            em.persist(card);
            await em.commit();
            return {
                card: card,
            };
        }
        catch (e) {
            await em.rollback();
            throw e;
        }
    }
    async deleteCard(targetId, { em }) {
        const card = await em.findOne(Card_1.Card, { _id: targetId });
        if (!card) {
            return false;
        }
        const basePath = path_1.default.join(`userFiles/user-${card.deck.user._id}/deck-${card.deck._id}/card-${card._id}/`);
        const targetPath = path_1.default.resolve("..", "web", "public", basePath);
        await em.begin();
        try {
            em.remove(card);
            if ((0, fs_1.existsSync)(targetPath)) {
                (0, fs_1.rm)(targetPath, { recursive: true }, (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log(`${targetPath} is deleted!`);
                });
            }
            await em.commit();
        }
        catch (e) {
            await em.rollback();
            throw e;
        }
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Card_1.Card]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CardResolver.prototype, "getCards", null);
__decorate([
    (0, type_graphql_1.Query)(() => Card_1.Card, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("_id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CardResolver.prototype, "card", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => CardResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Arg)("deckId", () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Arg)("image", () => graphql_upload_1.GraphQLUpload, { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)("audio", () => graphql_upload_1.GraphQLUpload, { nullable: true })),
    __param(4, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CardInput, Number, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CardResolver.prototype, "createCard", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Card_1.Card, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("_id")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CardResolver.prototype, "updateCardTitle", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => CardResponse),
    __param(0, (0, type_graphql_1.Arg)("targetId", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("image", () => graphql_upload_1.GraphQLUpload, { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)("audio", () => graphql_upload_1.GraphQLUpload, { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)("options")),
    __param(4, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object, CardInput, Object]),
    __metadata("design:returntype", Promise)
], CardResolver.prototype, "editCard", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("targetId", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CardResolver.prototype, "deleteCard", null);
CardResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CardResolver);
exports.CardResolver = CardResolver;
//# sourceMappingURL=card.js.map