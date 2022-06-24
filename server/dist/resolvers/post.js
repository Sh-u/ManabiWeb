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
exports.PostResolver = void 0;
const Post_1 = require("../entities/Post");
const type_graphql_1 = require("type-graphql");
const Deck_1 = require("../entities/Deck");
const graphql_upload_1 = require("graphql-upload");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const class_validator_1 = require("class-validator");
let PostInput = class PostInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, class_validator_1.Length)(5, 50),
    __metadata("design:type", String)
], PostInput.prototype, "sentence", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, class_validator_1.Length)(5, 15),
    __metadata("design:type", String)
], PostInput.prototype, "word", void 0);
PostInput = __decorate([
    (0, type_graphql_1.InputType)()
], PostInput);
let PostResponse = class PostResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], PostResponse.prototype, "error", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Post_1.Post, { nullable: true }),
    __metadata("design:type", Post_1.Post)
], PostResponse.prototype, "post", void 0);
PostResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], PostResponse);
let PostResolver = class PostResolver {
    async posts({ em }) {
        return em.find(Post_1.Post, {});
    }
    post(_id, { em }) {
        return em.findOne(Post_1.Post, { _id });
    }
    async createPost(options, deckId, image, audio, { em }) {
        if (options.sentence.length < 1 || options.word.length < 1) {
            return {
                error: "Input is too short",
            };
        }
        const currentDeck = await em.findOne(Deck_1.Deck, { _id: deckId });
        if (!currentDeck) {
            return {
                error: "Couldn't find a current deck in Post/Resolver",
            };
        }
        await em.begin();
        try {
            const post = await em.create(Post_1.Post, {
                sentence: options.sentence,
                word: options.word,
                deck: currentDeck,
            });
            try {
                await em.persistAndFlush(post);
            }
            catch (err) {
                console.log(err);
            }
            if (image) {
                console.log("mime", image.mimetype);
                image.filename = `image-${post._id}`;
            }
            if (audio) {
                console.log("mime", audio.mimetype);
                audio.filename = `audio-${post._id}`;
            }
            const basePath = path_1.default.join(`userFiles/user-${currentDeck.user._id}/deck-${currentDeck._id}/post-${post._id}/`);
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
                post.image = path_1.default.join(basePath, image.filename);
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
                post.userAudio = path_1.default.join(basePath, audio.filename);
            }
            await em.commit();
            return {
                post,
            };
        }
        catch (e) {
            await em.rollback();
            throw e;
        }
    }
    async updatePostTitle(_id, { em }) {
        const post = await em.findOne(Post_1.Post, { _id });
        if (!post) {
            return null;
        }
        await em.persistAndFlush(post);
        return post;
    }
    async editPost(targetId, image, audio, options, { em }) {
        if (options.sentence.length < 1 || options.word.length < 1) {
            return {
                error: "Input is too short",
            };
        }
        const post = await em.findOne(Post_1.Post, { _id: targetId });
        if (!post) {
            return {
                error: "Could not find a matching post",
            };
        }
        await em.begin();
        try {
            post.sentence = options.sentence;
            post.word = options.word;
            if (image) {
                console.log("mime", image.mimetype);
                image.filename = `image-${post._id}`;
            }
            if (audio) {
                console.log("mime", audio.mimetype);
                audio.filename = `audio-${post._id}`;
            }
            const basePath = path_1.default.join(`userFiles/user-${post.deck.user._id}/deck-${post.deck._id}/post-${post._id}/`);
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
                post.image = path_1.default.join(basePath, image.filename);
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
                post.userAudio = path_1.default.join(basePath, audio.filename);
            }
            em.persist(post);
            await em.commit();
            return {
                post,
            };
        }
        catch (e) {
            await em.rollback();
            throw e;
        }
    }
    async deletePost(targetId, { em }) {
        const post = await em.findOne(Post_1.Post, { _id: targetId });
        if (!post) {
            return false;
        }
        const basePath = path_1.default.join(`userFiles/user-${post.deck.user._id}/deck-${post.deck._id}/post-${post._id}/`);
        const targetPath = path_1.default.resolve("..", "web", "public", basePath);
        await em.begin();
        try {
            em.remove(post);
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
    (0, type_graphql_1.Query)(() => [Post_1.Post]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
__decorate([
    (0, type_graphql_1.Query)(() => Post_1.Post, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("_id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "post", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => PostResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Arg)("deckId", () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Arg)("image", () => graphql_upload_1.GraphQLUpload, { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)("audio", () => graphql_upload_1.GraphQLUpload, { nullable: true })),
    __param(4, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PostInput, Number, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Post_1.Post, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("_id")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePostTitle", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => PostResponse),
    __param(0, (0, type_graphql_1.Arg)("targetId", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("image", () => graphql_upload_1.GraphQLUpload, { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)("audio", () => graphql_upload_1.GraphQLUpload, { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)("options")),
    __param(4, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object, PostInput, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "editPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("targetId", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
PostResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=post.js.map