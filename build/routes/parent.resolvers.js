"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parent_model_1 = require("../models/parent.model");
const user_model_1 = require("../models/user.model");
const graphql_1 = require("graphql");
exports.default = {
    Query: {
        parents: async (_, args, context) => {
            if (!Object.keys(context.user).length) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const user = await (0, user_model_1.getUserByField)({ id: context.user.id });
            if (!user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            if (user.role === 'ADMIN') {
                return (0, parent_model_1.getAllParents)(args.page, args.take);
            }
            return (0, parent_model_1.getParentsByClass)(user.class, args.page, args.take);
        },
        parentById: async (_, args, context) => {
            if (!Object.keys(context.user).length) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const parent = await (0, parent_model_1.getParentById)(args.id);
            return parent;
        },
        findParent: async (_, args, context) => {
            if (!Object.keys(context.user).length) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const user = await (0, user_model_1.getUserByField)({ id: context.user.id });
            if (!user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            if (user.role === 'ADMIN') {
                return (0, parent_model_1.getFilteredParents)('', args.name);
            }
            return (0, parent_model_1.getFilteredParents)(user.class, args.name);
        },
    },
    Mutation: {
        createParent: async (_, args, context) => {
            if (!Object.keys(context.user).length) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const parent = await (0, parent_model_1.createParent)(args.parent);
            return parent;
        },
        createRelationship: async (_, args, context) => {
            if (!Object.keys(context.user).length) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const parent = await (0, parent_model_1.setRelationship)(args.relation);
            return parent;
        },
        updateParent: async (_, args, context) => {
            if (!Object.keys(context.user).length) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const parent = await (0, parent_model_1.updateParent)(args.id, args.data);
            return parent;
        },
    }
};
