"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parent_model_1 = require("../models/parent.model");
const graphql_1 = require("graphql");
exports.default = {
    Query: {
        parents: async (_, args, context) => {
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const parentLimit = await (0, parent_model_1.getAllParents)(args.page, args.take);
            return parentLimit;
        },
        parentById: async (_, args, context) => {
            if (!context.user) {
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
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const parent = await (0, parent_model_1.getFilteredParents)(args.name);
            return parent;
        },
    },
    Mutation: {
        createParent: async (_, args, context) => {
            if (!context.user) {
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
            if (!context.user) {
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
            if (!context.user) {
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
