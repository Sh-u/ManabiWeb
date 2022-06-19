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
let PostInput = class PostInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], PostInput.prototype, "sentence", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], PostInput.prototype, "word", void 0);
PostInput = __decorate([
    (0, type_graphql_1.InputType)()
], PostInput);
let PostResponse = class PostResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], PostResponse.prototype, "error", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Post_1.Post),
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
    async createPost(options, deckId, audio, image, { em }) {
        const currentDeck = await em.findOne(Deck_1.Deck, { _id: deckId });
        if (!currentDeck) {
            return {
                error: "Couldn't find a current deck in Post/Resolver"
            };
        }
        const post = await em.create(Post_1.Post, {
            sentence: options.sentence,
            word: options.word,
            deck: currentDeck
        });
        if (!post) {
            return {
                error: "Couldn't create Post"
            };
        }
        console.log('created post object');
        const basePathImage = path_1.default.join(`userFiles/${currentDeck.user._id}/deck-${currentDeck._id}/post/${post._id}/`, image.filename);
        const basePathAudio = path_1.default.join(`userFiles/${currentDeck.user._id}/deck-${currentDeck._id}/post/${post._id}/`, audio.filename);
        const targetPathImage = path_1.default.resolve('..', 'web', 'public', basePathImage);
        const targetPathAudio = path_1.default.resolve('..', 'web', 'public', basePathAudio);
        await new Promise((resolve, reject) => {
            image.createReadStream()
                .pipe((0, fs_1.createWriteStream)(targetPathImage))
                .on('finish', () => {
                console.log('finish');
                resolve(true);
            })
                .on('error', () => {
                console.log('error');
                reject(false);
            });
        });
        await new Promise((resolve, reject) => {
            audio.createReadStream()
                .pipe((0, fs_1.createWriteStream)(targetPathAudio))
                .on('finish', () => {
                console.log('finish');
                resolve(true);
            })
                .on('error', () => {
                console.log('error');
                reject(false);
            });
        });
        const imgMimes = [".jpeg", ".png", ".jpg"];
        const audioMimes = [".mp3", ".wav", ".ogg"];
        if (imgMimes.some((item) => item === image.mimetype)) {
            console.log('imgMime');
            post.image = basePathImage;
        }
        if (audioMimes.some((item) => item === audio.mimetype)) {
            console.log('imgMime');
            post.userAudio = basePathAudio;
        }
        try {
            await em.persistAndFlush(post);
        }
        catch (err) {
            console.log(err);
        }
        return {
            post
        };
    }
    async updatePostTitle(_id, { em }) {
        const post = await em.findOne(Post_1.Post, { _id });
        if (!post) {
            return null;
        }
        await em.persistAndFlush(post);
        return post;
    }
    async removePost(_id, { em }) {
        const post = await em.findOne(Post_1.Post, { _id });
        if (!post) {
            return false;
        }
        await em.removeAndFlush(post);
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
    __param(1, (0, type_graphql_1.Arg)("deckId")),
    __param(2, (0, type_graphql_1.Arg)("audio", () => graphql_upload_1.GraphQLUpload)),
    __param(3, (0, type_graphql_1.Arg)("image", () => graphql_upload_1.GraphQLUpload)),
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
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("_id")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "removePost", null);
PostResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=post.js.map