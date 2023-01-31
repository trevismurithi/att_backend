import { 
    getUsers,
    getUser,
    getUserById,
    createUser as createNewUser,
    createAttendance
} from "../models/user.model"
import { GraphQLError } from 'graphql'
import { signUser } from '../services/jwt'

const resolvers = {
    Query: {
        users: async (_: any, __: any, context: any) => {
            const users = await getUsers()
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
            return users
        },
        authUser: async (_: any, args: any) => {
            const user = await getUser(args.account) 
            if (!user) {
                throw new GraphQLError(
                    "User was not found",
                    {
                        extensions: {
                            code: 'FORBIDDEN',
                            http: { status: 404 }
                        }
                    }
                );   
            }
            const token = signUser(
                {id: user.id, username: user.username}
                )
            return {
                user,
                token
            }
        },
        userById: async (_: any, args: any, context: any) => {
            const user = await getUserById(args.id)
            if (!user) {
                throw new GraphQLError(
                    "User was not found",
                    {
                        extensions: {
                            code: 'FORBIDDEN',
                            http: { status: 404 }
                        }
                    }
                );   
            }
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
            return user
        }
    },
    Mutation: {
        createUser: (_:any, args: any) => {
            return createNewUser(args.account)
        },
        createAttendace: async (_: any, args: any, context: any) => {
            const attend = await createAttendance(args.id, args.studentId)
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
            return attend
        }
    }
}

export {
    resolvers
}