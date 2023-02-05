import { 
    getUsers,
    getUser,
    getUserById,
    createUser as createNewUser,
    createAttendance,
    getTokenById,
    updateUser,
    deleteToken,
    getUserByEmail,
    updateToken
} from "../models/user.model"
import { GraphQLError } from 'graphql'
import { signUser, compareDate, verifyUser } from '../services/jwt'
import crypto from 'crypto'
import { hashing, compareHash } from '../services/hashing'
import { sendMail } from '../services/mailer'

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
        authUser: async (_: any, args: any, context: any) => {           
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
            // TDOD: check if user is enabled
            // generate token and refresh token
            const token = signUser(
                {id: user.id, username: user.username},
                '10m'
                )
            const refreshToken = signUser(
                { id: user.id, username: user.username },
                '1d'
            )
            // set cookie in browser
            await context.res.cookie('jsonwebtoken', refreshToken, {
                path: '/',
                httpOnly: true,
                SameSite: 'None',
                maxAge: 24 * 3600 * 1000

            })
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
        },
        refreshToken: async (_: any, __: any, context: any) => {
            console.log(context.req.cookies)
            // get tokens if available
            if (!context.req.cookies || !context.req.cookies.jsonwebtoken) {
                throw new GraphQLError(
                    'Authentication expired',
                    {
                        extensions: {
                            code: 'FORBIDDEN',
                            http: { status: 401 }
                        }
                    }
                )
            }
            const refreshToken = context.req.cookies.jsonwebtoken
            const data: any = verifyUser(refreshToken)
            if (!data || !data.user) {
                throw new GraphQLError(
                    'Authentication expired: token denied',
                    {
                        extensions: {
                            code: 'FORBIDDEN',
                            http: { status: 401 }
                        }
                    }
                )
            }
            // get user and confirm user
            const user: any = await getUserById(data.user.id)
            if (!user) {
                throw new GraphQLError(
                    'Authentication expired: user not found',
                    {
                        extensions: {
                            code: 'FORBIDDEN',
                            http: { status: 401 }
                        }
                    }
                )   
            }
            // generate token and refresh token
            const token = signUser(
                { id: user.id, username: user.username },
                '10m'
            )

            return {
                token
            }
        } 
    },
    Mutation: {
        createUser: async (_:any, args: any) => {
            // generate a crypto token
            const token = crypto.randomBytes(32).toString('hex')
            // generate a bycrypt and save to db
            const encrypt = hashing(token)
            // save the token
            const user = await createNewUser(args.account, encrypt)
            // generate a url
            const url = `http://localhost:3000/activate?id=${user.id}&token=${token}`
            await sendMail(
                `
                <p>You can now activate your account</p>
                <p>${url}</p>
                `
            )
            return user
        },
        activateUser: async (_: any, args: any) => {
            // find user by id
            const encrypt = await getTokenById(args.id)
            if (!encrypt) {
                throw new GraphQLError(
                    'Link provided is invalid',
                    {
                        extensions: {
                            code: 'FORBIDDEN',
                            http: { status: 401 }
                        }
                    }
                )
            }
            // compare the token
            if (!compareHash(args.token, encrypt.token)) {
                throw new GraphQLError(
                    'Link provided is invalid',
                    {
                        extensions: {
                            code: 'FORBIDDEN',
                            http: { status: 401 }
                        }
                    }
                )
            }
            // enable the user then delete token
            await deleteToken(args.id)
            return updateUser(
                args.id,
                {
                    enabled: true
                }
                )
        },
        forgotPassword: async (_: any, args: any) => {
            // create token or update
            const user = await getUserByEmail(args.email)
            if (!user) {
                throw new GraphQLError(
                    'Invalid user email',
                    {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            http: { status: 400 }
                        }
                    }
                )
            }
            const token = crypto.randomBytes(32).toString('hex')
            await updateToken(user.id, hashing(token))
            // generate a url
            const url = `http://localhost:3000/activate?id=${user.id}&token=${token}`
            await sendMail(
                `
                <p>An email is sent to you to forget password</p>
                <p>${url}</p>
                `
            )
            return 'email sent...'
        },
        resetPassword: async (_: any, args: any) => {
            // validate user
            const user = await getUserById(args.id)
            if (!user) {
                throw new GraphQLError(
                    'Invalid link provided',
                    {
                        extensions: {
                            code: 'FORBIDDEN',
                            http: { status: 403 }
                        }
                    }
                )
            }
            // validate get token and validate
            const encrypt: any = await getTokenById(args.id)
            if (!encrypt) {
                throw new GraphQLError(
                    'Invalid link provided',
                    {
                        extensions: {
                            code: 'FORBIDDEN',
                            http: { status: 403 }
                        }
                    }
                )
            }
            // compare token
            if (
                !compareHash(args.token, encrypt.token) 
                || 
                compareDate(encrypt.updatedAt, Date.now()) > 15) {
                throw new GraphQLError(
                    'Invalid link provided. Time has expired',
                    {
                        extensions: {
                            code: 'FORBIDDEN',
                            http: { status: 403 }
                        }
                    }
                ) 
            }
            // update the password and delete the token
            await deleteToken(args.id)
            await updateUser(
                args.id,
                {
                    password: args.password
                }
            )
            return "success password reset"
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