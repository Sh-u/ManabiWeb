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
exports.UserResolver = exports.BadgeUpdateIntervals = void 0;
const argon2_1 = __importDefault(require("argon2"));
const date_fns_1 = require("date-fns");
const fs_1 = require("fs");
const graphql_upload_1 = require("graphql-upload");
const path_1 = __importDefault(require("path"));
const type_graphql_1 = require("type-graphql");
const uuid_1 = require("uuid");
const constants_1 = require("../constants");
const User_1 = require("../entities/User");
const sendMail_1 = require("../utility/sendMail");
var BadgeUpdateIntervals;
(function (BadgeUpdateIntervals) {
    BadgeUpdateIntervals[BadgeUpdateIntervals["improving"] = 14] = "improving";
    BadgeUpdateIntervals[BadgeUpdateIntervals["scholar"] = 90] = "scholar";
    BadgeUpdateIntervals[BadgeUpdateIntervals["cardMaster"] = 365] = "cardMaster";
})(BadgeUpdateIntervals = exports.BadgeUpdateIntervals || (exports.BadgeUpdateIntervals = {}));
let RegisterInput = class RegisterInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], RegisterInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], RegisterInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], RegisterInput.prototype, "password", void 0);
RegisterInput = __decorate([
    (0, type_graphql_1.InputType)()
], RegisterInput);
let LoginInput = class LoginInput {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], LoginInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], LoginInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], LoginInput.prototype, "password", void 0);
LoginInput = __decorate([
    (0, type_graphql_1.InputType)()
], LoginInput);
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
let FollowResponse = class FollowResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], FollowResponse.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], FollowResponse.prototype, "message", void 0);
FollowResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], FollowResponse);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let UserResolver = class UserResolver {
    async followUser({ em, req }, targetUserId) {
        const currentUser = await em.findOne(User_1.User, { _id: req.session.userId });
        if (!currentUser) {
            return {
                message: "follow user: current user not found",
            };
        }
        const targetUser = await em.findOne(User_1.User, { _id: targetUserId }, { populate: ["followers"] });
        if (!targetUser) {
            return {
                message: "follow user: target user not found",
            };
        }
        if (targetUser.followers.contains(currentUser)) {
            targetUser.followers.remove(currentUser);
            try {
                await em.persistAndFlush(targetUser);
            }
            catch (err) {
                console.log(err);
            }
            return {
                user: targetUser,
                message: "unfollowed",
            };
        }
        targetUser.followers.add(currentUser);
        try {
            await em.persistAndFlush(targetUser);
        }
        catch (err) {
            console.log(err);
        }
        return {
            user: targetUser,
            message: "followed",
        };
    }
    async updateBadge({ em }, _username) {
        const targetUser = await em.findOne(User_1.User, { username: _username });
        if (!targetUser) {
            return false;
        }
        const creationDate = targetUser === null || targetUser === void 0 ? void 0 : targetUser.createdAt;
        const currentDate = new Date();
        if ((0, date_fns_1.differenceInDays)(currentDate, creationDate) <
            BadgeUpdateIntervals.improving) {
            return false;
        }
        else if ((0, date_fns_1.differenceInDays)(currentDate, creationDate) >=
            BadgeUpdateIntervals.cardMaster) {
            targetUser.badge = "Card Master";
        }
        else if ((0, date_fns_1.differenceInDays)(currentDate, creationDate) >=
            BadgeUpdateIntervals.scholar) {
            targetUser.badge = "Scholar";
        }
        else if ((0, date_fns_1.differenceInDays)(currentDate, creationDate) >=
            BadgeUpdateIntervals.improving) {
            targetUser.badge = "Improving";
        }
        try {
            await em.persistAndFlush(targetUser);
        }
        catch (err) {
            console.log(err);
        }
        return true;
    }
    async forgotPassword({ em, redis }, _username) {
        const user = await em.findOne(User_1.User, { username: _username });
        if (!user) {
            return false;
        }
        const token = (0, uuid_1.v4)();
        await redis.set(constants_1.FORGOT_PASSWORD_PREFIX + token, user._id, "EX", 1000 * 60 * 60 * 24);
        const redirect = `<a href="localhost:3000/reset-password/${token}">Reset Password</a>`;
        await (0, sendMail_1.sendMail)(user.email, "Manabi: Password Change Request", redirect);
        return true;
    }
    async uploadAvatar({ em, req }, image) {
        const currentUser = await em.findOne(User_1.User, { _id: req.session.userId });
        const { createReadStream, filename } = await image;
        if (!currentUser) {
            return false;
        }
        const basePath = path_1.default.join("userFiles", `user-${currentUser._id}`, `avatar-${currentUser._id}`);
        console.log(`basepath`, basePath);
        const targetPath = path_1.default.resolve("..", "web", "public", basePath);
        if (currentUser.image) {
            await (0, fs_1.unlink)(targetPath, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        console.log(`target`, targetPath);
        new Promise(async (resolve, reject) => {
            createReadStream()
                .pipe((0, fs_1.createWriteStream)(targetPath))
                .on("finish", () => {
                console.log("finish");
                return resolve(true);
            })
                .on("error", () => {
                console.log("ee");
                return reject(false);
            });
        });
        currentUser.image = basePath;
        try {
            await em.persistAndFlush(currentUser);
        }
        catch (err) {
            console.log(err);
            return false;
        }
        return true;
    }
    async me({ req, em }) {
        if (!req.session.userId) {
            return null;
        }
        const user = await em.findOne(User_1.User, { _id: req.session.userId });
        if (!user) {
            return null;
        }
        if (!user.decks.isInitialized()) {
            await user.decks.init();
        }
        return user;
    }
    async getUsers({ em }) {
        const users = await em.find(User_1.User, {}, { populate: ["followers"] });
        return users;
    }
    async getFriends({ em }, targetUserId) {
        const targetUser = await em.findOne(User_1.User, { _id: targetUserId }, { populate: true });
        console.log(targetUser === null || targetUser === void 0 ? void 0 : targetUser.followers.getItems());
        if (!targetUser) {
            console.log("getFriends error");
            return null;
        }
        const friends = await em.find(User_1.User, {
            following: targetUser,
            followers: targetUser,
        });
        if (!friends) {
            console.log("no friends");
            return null;
        }
        return friends;
    }
    async findUser({ em }, targetUsername) {
        console.log("find");
        const targetUser = await em.findOne(User_1.User, { username: targetUsername }, { populate: true });
        console.log(targetUser === null || targetUser === void 0 ? void 0 : targetUser.followers.getItems());
        if (!targetUser) {
            console.log("error");
            return {
                errors: [
                    {
                        message: "Find User: Cannot find user with this Id",
                    },
                ],
            };
        }
        console.log("good");
        return {
            user: targetUser,
        };
    }
    async changePassword(token, newPassword, { req, em, redis }) {
        if (newPassword.includes("@")) {
            return {
                errors: [
                    {
                        field: "newPassword",
                        message: "Password is invalid",
                    },
                ],
            };
        }
        if (newPassword.length < 3) {
            return {
                errors: [
                    {
                        field: "newPassword",
                        message: "Password is too short",
                    },
                ],
            };
        }
        const userId = await redis.get(constants_1.FORGOT_PASSWORD_PREFIX + token);
        if (!userId) {
            return {
                errors: [
                    {
                        field: "newPassword",
                        message: "Something went wrong, please try again later",
                    },
                ],
            };
        }
        const user = await em.findOne(User_1.User, { _id: userId });
        if (!user) {
            return {
                errors: [
                    {
                        field: "newPassword",
                        message: "User not found",
                    },
                ],
            };
        }
        const hashedPassword = await argon2_1.default.hash(newPassword);
        user.password = hashedPassword;
        await em.persistAndFlush(user);
        req.session.userId = user._id;
        return {
            user,
        };
    }
    async changeUsername(newUsername, { req, em }) {
        if (!req.session.userId) {
            return {
                errors: [
                    {
                        field: "Username",
                        message: "No active user found",
                    },
                ],
            };
        }
        const currentUser = await em.findOne(User_1.User, { _id: req.session.userId });
        if (!currentUser) {
            return {
                errors: [
                    {
                        field: "Username",
                        message: "Cannot find matching user",
                    },
                ],
            };
        }
        console.log("newname", newUsername);
        const userWithThatName = await em.findOne(User_1.User, { username: newUsername });
        if (userWithThatName) {
            return {
                errors: [
                    {
                        field: "Username",
                        message: "Username already taken",
                    },
                ],
            };
        }
        if (newUsername.length < 4 || newUsername.includes("@")) {
            return {
                errors: [
                    {
                        field: "Username",
                        message: "Invalid username",
                    },
                ],
            };
        }
        currentUser.username = newUsername;
        await em.persistAndFlush(currentUser);
        return {
            user: currentUser,
        };
    }
    async changeEmail(newEmail, { req, em }) {
        if (!req.session.userId) {
            return {
                errors: [
                    {
                        field: "Username",
                        message: "No active user found",
                    },
                ],
            };
        }
        const currentUser = await em.findOne(User_1.User, { _id: req.session.userId });
        if (!currentUser) {
            return {
                errors: [
                    {
                        field: "Username",
                        message: "Cannot find matching user",
                    },
                ],
            };
        }
        if (newEmail.length < 4 || !newEmail.includes("@")) {
            return {
                errors: [
                    {
                        field: "Username",
                        message: "Invalid email",
                    },
                ],
            };
        }
        currentUser.email = newEmail;
        await em.persistAndFlush(currentUser);
        return {
            user: currentUser,
        };
    }
    async logout({ req, res }) {
        if (!req.session.userId) {
            console.log("Logout ERROR => NO ACTIVE USER FOUND");
            return false;
        }
        const response = await new Promise((_res) => req.session.destroy((err) => {
            res.clearCookie(constants_1.COOKIE_NAME);
            if (err) {
                console.log(err);
                _res(false);
                return;
            }
            _res(true);
        }));
        return response;
    }
    async register(options, { em, req }) {
        if (options.username.length < 3) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "username is too short",
                    },
                ],
            };
        }
        if (options.username.includes("@")) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "username cannot contain '@' sign",
                    },
                ],
            };
        }
        if (options.email.length < 3) {
            return {
                errors: [
                    {
                        field: "email",
                        message: "email address is too short",
                    },
                ],
            };
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(options.email)) {
            return {
                errors: [
                    {
                        field: "email",
                        message: "invalid email address",
                    },
                ],
            };
        }
        if (options.password.length < 3) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "password is too short",
                    },
                ],
            };
        }
        const hashedPassword = await argon2_1.default.hash(options.password);
        const user = await em.create(User_1.User, {
            username: options.username,
            password: hashedPassword,
            email: options.email,
        });
        if (!user) {
            return {
                errors: [
                    {
                        field: "register",
                        message: "cannot register",
                    },
                ],
            };
        }
        try {
            await em.persistAndFlush(user);
        }
        catch (err) {
            console.log(err);
            if (err.code === "23505") {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "user already exists",
                        },
                    ],
                };
            }
        }
        const targetPath = path_1.default.resolve("..", "web", "public", "userFiles", `user-${user._id}`);
        if (!(0, fs_1.existsSync)(targetPath)) {
            (0, fs_1.mkdir)(targetPath, (err) => {
                if (err) {
                    return console.log(err);
                }
            });
        }
        console.log(`user id`, user._id);
        req.session.userId = user._id;
        return {
            user,
        };
    }
    async login(options, { em, req }) {
        if (!options.email && !options.username) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "username or email was not provided",
                    },
                ],
            };
        }
        const user = await em.findOne(User_1.User, options.email ? { email: options.email } : { username: options.username });
        if (!user) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "User not found",
                    },
                ],
            };
        }
        const valid = await argon2_1.default.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "wrong password",
                    },
                ],
            };
        }
        req.session.userId = user._id;
        return {
            user,
        };
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => FollowResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("targetUserId", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "followUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateBadge", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("image", () => graphql_upload_1.GraphQLUpload)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "uploadAvatar", null);
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.User]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUsers", null);
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.User], { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("targetUserId", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getFriends", null);
__decorate([
    (0, type_graphql_1.Query)(() => UserResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("targetUsername", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "findUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("token")),
    __param(1, (0, type_graphql_1.Arg)("newPassword")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("newUsername")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changeUsername", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("newEmail")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changeEmail", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map