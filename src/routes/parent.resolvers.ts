import { 
    getAllParents, 
    createParent as addParent,
    setRelationship,
    getParentById,
    getFilteredParents,
    updateParent,
    getParentsByClass
} from "../models/parent.model"

import { getUserByField } from "../models/user.model";

import { GraphQLError } from 'graphql'

export default {
    Query: {
        parents: async (_: any, args: any, context: any) => {
            if (!Object.keys(context.user).length) {
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
            const user:any = await getUserByField({ id: context.user.id})
            if (!user) {
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
            if(user.role === 'ADMIN') {
                return getAllParents(args.page, args.take)
            }
            return getParentsByClass(user.class, args.page, args.take)
        },
        parentById: async (_: any, args: any, context: any) => {
            if (!Object.keys(context.user).length) {
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
            if (!Object.keys(context.user).length) {
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
            const user:any = await getUserByField({ id: context.user.id})
            if (!user) {
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
            if (user.role === 'ADMIN') {
                return getFilteredParents('', args.name)
            }
            return getFilteredParents(user.class, args.name)
        },
    },
    Mutation: {
        createParent: async (_:any, args: any, context: any) => {
            if (!Object.keys(context.user).length) {
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
            if (!Object.keys(context.user).length) {
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
            if (!Object.keys(context.user).length) {
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

