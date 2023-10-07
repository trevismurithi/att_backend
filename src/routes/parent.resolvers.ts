import { 
    getAllParents, 
    createParent as addParent,
    setRelationship,
    getParentById,
    getFilteredParents,
    updateParent
} from "../models/parent.model"

import { GraphQLError } from 'graphql'

export default {
    Query: {
        parents: async (_: any, args: any, context: any) => {
            if (!context.user) {
                throw new GraphQLError(
                    "You are not authorized to perform this action",
                    {
                        extensions: {
                            code: 'FORBIDDEN',
                            http: { status: 401 }
                        }
                    }
                );   
            }
            const parentLimit = await getAllParents(args.page, args.take)
            return parentLimit
        },
        parentById: async (_: any, args: any, context: any) => {
            if (!context.user) {
                throw new GraphQLError(
                    "You are not authorized to perform this action",
                    {
                        extensions: {
                            code: 'FORBIDDEN',
                            http: { status: 401 }
                        }
                    }
                );   
            }
            const parent = await getParentById(args.id)
            return parent
        },
        findParent: async (_: any, args: any, context: any) => {
            if (!context.user) {
                throw new GraphQLError(
                    "You are not authorized to perform this action",
                    {
                        extensions: {
                            code: 'FORBIDDEN',
                            http: { status: 401 }
                        }
                    }
                );   
            }
            const parent = await getFilteredParents(args.name)
            return parent
        },
    },
    Mutation: {
        createParent: async (_:any, args: any, context: any) => {
            if (!context.user) {
                throw new GraphQLError(
                    "You are not authorized to perform this action",
                    {
                        extensions: {
                            code: 'FORBIDDEN',
                            http: { status: 401 }
                        }
                    }
                );   
            }
            const parent = await addParent(args.parent)
            return parent
        },
        createRelationship: async (_:any, args: any, context: any) => {
            if (!context.user) {
                throw new GraphQLError(
                    "You are not authorized to perform this action",
                    {
                        extensions: {
                            code: 'FORBIDDEN',
                            http: { status: 401 }
                        }
                    }
                );   
            }
            const parent = await setRelationship(args.relation)
            return parent
        },
        updateParent: async (_:any, args: any, context: any) => {
            if (!context.user) {
                throw new GraphQLError(
                    "You are not authorized to perform this action",
                    {
                        extensions: {
                            code: 'FORBIDDEN',
                            http: { status: 401 }
                        }
                    }
                );   
            }
            const parent = await updateParent(args.id, args.data)
            return parent
        },
    }
}

