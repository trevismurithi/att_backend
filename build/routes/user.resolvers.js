"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/user.model");
const graphql_1 = require("graphql");
const jwt_1 = require("../services/jwt");
const crypto_1 = __importDefault(require("crypto"));
const hashing_1 = require("../services/hashing");
const mailer_1 = require("../services/mailer");
exports.default = {
    Query: {
        users: async (_, __, context) => {
            const users = await (0, user_model_1.getUsers)();
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            return users;
        },
        authUser: async (_, args, context) => {
            const user = await (0, user_model_1.getUser)(args.account);
            if (!user) {
                throw new graphql_1.GraphQLError("User was not found", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 404 }
                    }
                });
            }
            // TDOD: check if user is enabled
            // generate token and refresh token
            const token = (0, jwt_1.signUser)({ id: user.id, username: user.username }, '10m');
            const refreshToken = (0, jwt_1.signUser)({ id: user.id, username: user.username }, '1d');
            // set cookie in browser
            await context.res.cookie('jsonwebtoken', refreshToken, {
                path: '/',
                httpOnly: true,
                SameSite: 'none',
                maxAge: 24 * 3600 * 1000
            });
            return {
                user,
                token
            };
        },
        userById: async (_, args, context) => {
            const user = await (0, user_model_1.getUserById)(args.id);
            if (!user) {
                throw new graphql_1.GraphQLError("User was not found", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 404 }
                    }
                });
            }
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            return user;
        },
        refreshToken: async (_, __, context) => {
            console.log(context.req.cookies);
            // get tokens if available
            if (!context.req.cookies || !context.req.cookies.jsonwebtoken) {
                throw new graphql_1.GraphQLError('Authentication expired', {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const refreshToken = context.req.cookies.jsonwebtoken;
            const data = (0, jwt_1.verifyUser)(refreshToken);
            if (!data || !data.user) {
                throw new graphql_1.GraphQLError('Authentication expired: token denied', {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            // get user and confirm user
            const user = await (0, user_model_1.getUserById)(data.user.id);
            if (!user) {
                throw new graphql_1.GraphQLError('Authentication expired: user not found', {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            // generate token and refresh token
            const token = (0, jwt_1.signUser)({ id: user.id, username: user.username }, '10m');
            return {
                token
            };
        }
    },
    Mutation: {
        createUser: async (_, args) => {
            // generate a crypto token
            const token = crypto_1.default.randomBytes(32).toString('hex');
            // generate a bycrypt and save to db
            const encrypt = (0, hashing_1.hashing)(token);
            // save the token
            const user = await (0, user_model_1.createUser)(args.account, encrypt);
            // generate a url
            const url = `http://localhost:3000/activate?id=${user.id}&token=${token}`;
            await (0, mailer_1.sendMail)(`
                <p>You can now activate your account</p>
                <p>${url}</p>
                `);
            return user;
        },
        activateUser: async (_, args) => {
            // find user by id
            const encrypt = await (0, user_model_1.getTokenById)(args.id);
            if (!encrypt) {
                throw new graphql_1.GraphQLError('Link provided is invalid', {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            // compare the token
            if (!(0, hashing_1.compareHash)(args.token, encrypt.token)) {
                throw new graphql_1.GraphQLError('Link provided is invalid', {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            // enable the user then delete token
            await (0, user_model_1.deleteToken)(args.id);
            return (0, user_model_1.updateUser)(args.id, {
                enabled: true
            });
        },
        forgotPassword: async (_, args) => {
            // create token or update
            const user = await (0, user_model_1.getUserByEmail)(args.email);
            if (!user) {
                throw new graphql_1.GraphQLError('Invalid user email', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        http: { status: 400 }
                    }
                });
            }
            const token = crypto_1.default.randomBytes(32).toString('hex');
            await (0, user_model_1.updateToken)(user.id, (0, hashing_1.hashing)(token));
            // generate a url
            const url = `http://localhost:3000/activate?id=${user.id}&token=${token}`;
            await (0, mailer_1.sendMail)(`
                <p>An email is sent to you to forget password</p>
                <p>${url}</p>
                `);
            return 'email sent...';
        },
        resetPassword: async (_, args) => {
            // validate user
            const user = await (0, user_model_1.getUserById)(args.id);
            if (!user) {
                throw new graphql_1.GraphQLError('Invalid link provided', {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 403 }
                    }
                });
            }
            // validate get token and validate
            const encrypt = await (0, user_model_1.getTokenById)(args.id);
            if (!encrypt) {
                throw new graphql_1.GraphQLError('Invalid link provided', {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 403 }
                    }
                });
            }
            // compare token
            if (!(0, hashing_1.compareHash)(args.token, encrypt.token)
                ||
                    (0, jwt_1.compareDate)(encrypt.updatedAt, Date.now()) > 15) {
                throw new graphql_1.GraphQLError('Invalid link provided. Time has expired', {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 403 }
                    }
                });
            }
            // update the password and delete the token
            await (0, user_model_1.deleteToken)(args.id);
            await (0, user_model_1.updateUser)(args.id, {
                password: args.password
            });
            return "success password reset";
        },
        createAttendace: async (_, args, context) => {
            const attend = await (0, user_model_1.createAttendance)(args.id, args.studentId);
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            return attend;
        }
    }
};
