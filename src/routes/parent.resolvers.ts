import { 
    getAllParents, 
    createParent as addParent,
    setRelationship,
    getParentById
} from "../models/parent.model"

import { GraphQLError } from 'graphql'

export const resolvers = {
    Query: {
        parents: async (_: any, __: any, context: any) => {
            const parents = await getAllParents()
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
            return parents
        },
        parentById: async (_: any, args: any, context: any) => {
            const parent = await getParentById(args.id)
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
            return parent
        }
    },
    Mutation: {
        createParent: async (_:any, args: any, context: any) => {
            const parent = await addParent(args.parent)
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
            return parent
        },
        createRelationship: async (_:any, args: any, context: any) => {
            const parent = await setRelationship(args.relation)
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
            return parent
        }
    }
}

