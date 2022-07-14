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
const User_1 = require("../entities/User");
const PitchAccent_1 = require("../entities/PitchAccent");
const jpRegex_1 = require("../utility/jpRegex");
const node_html_parser_1 = __importDefault(require("node-html-parser"));
const stream_1 = require("stream");
const getWordAudio = async (word) => {
    var _a;
    const basePath = path_1.default.join("audio", `${word}.ogg`);
    const targetPath = path_1.default.resolve("..", "web", "public", basePath);
    if ((0, fs_1.existsSync)(targetPath)) {
        return {
            error: "path already exists",
            success: false,
            path: basePath,
        };
    }
    const html = await fetch(`https://www.japandict.com/${word}?lang=eng#entry-1263710`, {
        headers: { Accept: "text/html" },
    });
    if (!html.body)
        return {
            error: "Could not get html body",
            success: false,
        };
    const root = (0, node_html_parser_1.default)(await html.text());
    const [, text, jwt, vid] = JSON.parse(((_a = root === null || root === void 0 ? void 0 : root.querySelector(".play-reading-btn")) === null || _a === void 0 ? void 0 : _a.getAttribute("data-reading")) ||
        "[]");
    if (text === "[]" || jwt === "[]" || vid === "[]") {
        return {
            error: "Could not get request params",
            success: false,
        };
    }
    const params = {
        text: text,
        outputFormat: "ogg_vorbis",
        jwt: jwt,
        vid: vid,
    };
    const response = await fetch("https://www.japandict.com/voice/read?" + new URLSearchParams(params));
    switch (response === null || response === void 0 ? void 0 : response.status) {
        case 404: {
            console.log("jpdict 404");
            return {
                error: "Server Responded with 404 error",
                success: false,
            };
        }
        case 401: {
            console.log("jpdict 401 - invalid token");
            return {
                error: "Server Responded with 401 error",
                success: false,
            };
        }
        case 400: {
            console.log("jpdict 400 - bad request");
            return {
                error: "Server Responded with 400 error",
                success: false,
            };
        }
    }
    const arrayBuffer = await response.arrayBuffer();
    const stream = stream_1.Readable.from(Buffer.from(arrayBuffer));
    await new Promise((resolve, reject) => {
        stream
            .pipe((0, fs_1.createWriteStream)(targetPath))
            .on("finish", () => {
            console.log("finish");
            resolve(true);
        })
            .on("error", (err) => {
            console.log("error", err);
            reject(false);
        });
    });
    return {
        success: true,
        path: basePath,
    };
};
let ScrappedAudioResponse = class ScrappedAudioResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], ScrappedAudioResponse.prototype, "error", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], ScrappedAudioResponse.prototype, "success", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], ScrappedAudioResponse.prototype, "path", void 0);
ScrappedAudioResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], ScrappedAudioResponse);
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
__decorate([
    (0, type_graphql_1.Field)(() => ScrappedAudioResponse, { nullable: true }),
    __metadata("design:type", ScrappedAudioResponse)
], CardResponse.prototype, "scrappedAudioResponse", void 0);
CardResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], CardResponse);
let LearnAndReviewResponse = class LearnAndReviewResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], LearnAndReviewResponse.prototype, "error", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Card_1.Card], { nullable: true }),
    __metadata("design:type", Array)
], LearnAndReviewResponse.prototype, "learn", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Card_1.Card], { nullable: true }),
    __metadata("design:type", Array)
], LearnAndReviewResponse.prototype, "review", void 0);
LearnAndReviewResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], LearnAndReviewResponse);
let CardResolver = class CardResolver {
    async getCards({ em }) {
        return em.find(Card_1.Card, {});
    }
    async getScrapedAudio(word) {
        return await getWordAudio(word);
    }
    async deleteCards(cardId, { em }) {
        var _a, _b;
        const card = await em.findOne(Card_1.Card, { _id: cardId }, { populate: true });
        if (!card) {
            return false;
        }
        try {
            (_a = card.pitchAccent) === null || _a === void 0 ? void 0 : _a.removeAll();
            (_b = card.cardProgresses) === null || _b === void 0 ? void 0 : _b.removeAll();
            await em.removeAndFlush(card);
        }
        catch (err) {
            console.log(err);
        }
        return true;
    }
    async segmentTest(words) {
        const kotuSegmentResponse = await fetch("https://kotu.io/api/dictionary/segment", {
            method: "POST",
            body: words,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        if (!kotuSegmentResponse) {
            return false;
        }
        const parsed = await kotuSegmentResponse.json();
        const values = ["d", "a"];
        const kotuParseResponse = await fetch("https://kotu.io/api/dictionary/parse", {
            method: "POST",
            body: words,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const parsed2 = await kotuParseResponse.json();
        const sdsd = [-1];
        const kotuMora = parsed2[0].accentPhrases.map((obj) => {
            return obj.components[0].pitchAccents[0];
        });
        const kotuKana = parsed2[0].accentPhrases.map((obj) => obj.components[0].kana);
        const kotuWord = parsed2[0].accentPhrases.map((obj) => obj.components[0].surface);
        console.log("kotuMora", kotuMora);
        console.log("kotuKana", kotuKana);
        console.log("kotuWord", kotuWord);
        return true;
    }
    async getLearnAndReviewCards(deckId, { em }) {
        const currentDeck = await em.findOne(Deck_1.Deck, { _id: deckId }, { populate: ["cards"] });
        if (!currentDeck) {
            return {
                error: "Deck not found",
            };
        }
        const cards = await em.find(Card_1.Card, { deck: currentDeck }, { populate: ["cardProgresses"] });
        if (!cards) {
            return {
                error: "Cards not found",
            };
        }
        const currentDate = new Date();
        const result = cards.reduce((acc, card) => {
            if (card.cardProgresses
                .toArray()
                .find((progress) => progress.nextRevision < currentDate)) {
                if (card.cardProgresses
                    .toArray()
                    .find((progress) => (progress === null || progress === void 0 ? void 0 : progress.steps) > 2)) {
                    acc.review.push(card);
                }
                else {
                    acc.learn.push(card);
                }
            }
            return acc;
        }, { learn: [], review: [] });
        return result;
    }
    async getStudyCard({ em, req }) {
        var _a, _b;
        const currentUser = await em.findOne(User_1.User, { _id: req.session.userId });
        if (!currentUser) {
            return null;
        }
        const myProgressess = await em.find(CardProgress_1.CardProgress, { user: currentUser }, { populate: ["card.pitchAccent"] });
        const currentDate = new Date();
        const readyProgresses = myProgressess.filter((progress) => progress.nextRevision < currentDate);
        if (!readyProgresses || readyProgresses.length === 0) {
            return null;
        }
        console.log((_b = (_a = readyProgresses[0].card.pitchAccent) === null || _a === void 0 ? void 0 : _a.toArray()[0]) === null || _b === void 0 ? void 0 : _b.high);
        return readyProgresses[0].card;
    }
    async createCard(options, deckId, image, audio, { em }) {
        var _a, _b, _c;
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
        const audioResponse = {
            success: false,
        };
        console.log("options_________________________", options);
        const isInputJPchar = jpRegex_1.jpRegex.test(options.word);
        let jotobaWordAudio = null;
        let jotobaWordMeaning = null;
        let jotobaPitchAccent = null;
        let jotobaFurigana = null;
        let jotobaPitchHighs = null;
        let jotobaPitchParts = null;
        let kotuDescriptive = null;
        let kotuMora = null;
        let kotuKana = null;
        let kotuWord = null;
        let wordsToParse = null;
        let showKanaResponse = null;
        if (currentDeck.japaneseTemplate && isInputJPchar) {
            const requestJotobaWord = {
                query: options.word,
                language: "English",
                no_english: false,
            };
            const jotobaResponse = await fetch("https://jotoba.de/api/search/words", {
                method: "POST",
                body: JSON.stringify(requestJotobaWord),
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            const kotuSegmentResponse = await fetch("https://kotu.io/api/dictionary/segment", {
                method: "POST",
                body: options.sentence,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            if (kotuSegmentResponse) {
                const parsed = await kotuSegmentResponse.json();
                wordsToParse = parsed[0]
                    .filter((obj) => obj.partOfSpeech !== "補助記号" && obj.partOfSpeech !== "空白")
                    .map((obj) => { var _a; return (_a = obj.surface) !== null && _a !== void 0 ? _a : null; });
                console.log("wordsToParse", wordsToParse);
            }
            const kotuParseResponse = await fetch("https://kotu.io/api/dictionary/parse", {
                method: "POST",
                body: wordsToParse === null || wordsToParse === void 0 ? void 0 : wordsToParse.join(""),
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            if (kotuParseResponse) {
                const parsed = await kotuParseResponse.json();
                kotuMora = parsed[0].accentPhrases.map((obj) => obj.components[0].pitchAccents[0].mora);
                console.log("moraResponse", kotuMora);
                kotuDescriptive = parsed[0].accentPhrases.map((obj) => obj.components[0].pitchAccents[0].descriptive);
                console.log("descriptiveResponse", kotuDescriptive);
                kotuKana = parsed[0].accentPhrases.map((obj) => obj.components[0].kana);
                console.log("kanaResponse", kotuKana);
                showKanaResponse = parsed[0].accentPhrases.map((obj) => obj.components[0].kana !== obj.components[0].surface);
                console.log("showKanaResponse", showKanaResponse);
                kotuWord = parsed[0].accentPhrases.map((obj) => obj.components[0].surface);
                console.log("kotuWord", kotuWord);
            }
            if (jotobaResponse) {
                const parsed = await jotobaResponse.json();
                const firstObjectWithMatchingWord = parsed.words.find((obj) => kotuKana === null || kotuKana === void 0 ? void 0 : kotuKana.includes(obj.reading.kana));
                console.log("firstObjectWithMatchingWord", firstObjectWithMatchingWord);
                const firstObjectWithAudio = parsed.words.find((obj) => obj.audio);
                const firstObjectNoAudio = parsed.words[0];
                jotobaFurigana =
                    options.word.length === 1
                        ? parsed.kanji[0].kunyomi[0]
                        : parsed.words[0].reading.kana;
                jotobaWordMeaning =
                    (_a = firstObjectWithMatchingWord === null || firstObjectWithMatchingWord === void 0 ? void 0 : firstObjectWithMatchingWord.senses[0].glosses) !== null && _a !== void 0 ? _a : null;
                const pitch = firstObjectWithMatchingWord === null || firstObjectWithMatchingWord === void 0 ? void 0 : firstObjectWithMatchingWord.pitch;
                jotobaWordAudio = (firstObjectWithMatchingWord === null || firstObjectWithMatchingWord === void 0 ? void 0 : firstObjectWithMatchingWord.audio)
                    ? `https://jotoba.de${firstObjectWithMatchingWord === null || firstObjectWithMatchingWord === void 0 ? void 0 : firstObjectWithMatchingWord.audio}`
                    : null;
                jotobaPitchHighs = (_b = pitch === null || pitch === void 0 ? void 0 : pitch.map((obj) => obj.high)) !== null && _b !== void 0 ? _b : null;
                jotobaPitchParts = (_c = pitch === null || pitch === void 0 ? void 0 : pitch.map((obj) => obj.part)) !== null && _c !== void 0 ? _c : null;
                console.log("meaning", jotobaWordMeaning);
                console.log("highs", jotobaPitchHighs);
                console.log("parts", jotobaPitchParts);
            }
        }
        if (!jotobaWordAudio) {
            const { error, success, path } = await getWordAudio(options.word);
            jotobaWordAudio = path !== null && path !== void 0 ? path : null;
            console.log(jotobaWordAudio);
            audioResponse.error = error !== null && error !== void 0 ? error : null;
            audioResponse.success = success;
        }
        await em.begin();
        try {
            const card = await em.create(Card_1.Card, {
                sentence: options.sentence,
                sentenceArr: wordsToParse,
                word: options.word,
                deck: currentDeck,
                dictionaryAudio: jotobaWordAudio,
                dictionaryMeaning: jotobaWordMeaning,
                furigana: jotobaFurigana,
            });
            console.log("kotumora", kotuMora);
            if (kotuMora === null || kotuMora === void 0 ? void 0 : kotuMora.length) {
                for (let i = 0; i < kotuMora.length; i++) {
                    const part = await em.create(PitchAccent_1.PitchAccent, {
                        part: jotobaPitchParts && jotobaPitchParts,
                        high: jotobaPitchHighs && jotobaPitchHighs,
                        showKana: showKanaResponse && showKanaResponse[i],
                        descriptive: kotuDescriptive && kotuDescriptive[i],
                        word: kotuWord && kotuWord[i],
                        kana: kotuKana && kotuKana[i],
                        mora: kotuMora && kotuMora[i],
                        card: card,
                    });
                    await em.persist(part);
                }
            }
            const progress = await em.create(CardProgress_1.CardProgress, {
                card: card,
                user: card.deck.user._id,
            });
            await em.persist(progress);
            try {
                await em.persistAndFlush(card);
            }
            catch (err) {
                console.log(err);
            }
            if (image) {
                image.filename = `image-${card._id}`;
            }
            if (audio) {
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
                scrappedAudioResponse: audioResponse,
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
    (0, type_graphql_1.Query)(() => ScrappedAudioResponse),
    __param(0, (0, type_graphql_1.Arg)("word", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CardResolver.prototype, "getScrapedAudio", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("cardId", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CardResolver.prototype, "deleteCards", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("words", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CardResolver.prototype, "segmentTest", null);
__decorate([
    (0, type_graphql_1.Query)(() => LearnAndReviewResponse),
    __param(0, (0, type_graphql_1.Arg)("deckId", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CardResolver.prototype, "getLearnAndReviewCards", null);
__decorate([
    (0, type_graphql_1.Query)(() => Card_1.Card, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CardResolver.prototype, "getStudyCard", null);
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