"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const parent_model_1 = require("../models/parent.model");
const graphql_1 = require("graphql");
exports.resolvers = {
    Query: {
        parents: async (_, __, context) => {
            const parents = await (0, parent_model_1.getAllParents)();
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            return parents;
        },
        parentById: async (_, args, context) => {
            const parent = await (0, parent_model_1.getParentById)(args.id);
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            return parent;
        }
    },
    Mutation: {
        createParent: async (_, args, context) => {
            const parent = await (0, parent_model_1.createParent)(args.parent);
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            return parent;
        },
        createRelationship: async (_, args, context) => {
            const parent = await (0, parent_model_1.setRelationship)(args.relation);
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            return parent;
        }
    }
};
