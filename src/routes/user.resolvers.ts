import { 
    getUsers,
    getUserByField,
    getUserBySearch,
    createUser as createNewUser,
    createAttendance,
    getTokenById,
    updateUser,
    deleteToken,
    updateToken,
    getContactsByUser
} from "../models/user.model"
import { GraphQLError } from 'graphql'
import { signUser, compareDate, verifyUser } from '../services/jwt'
import crypto from 'crypto'
import { hashing, compareHash } from '../services/hashing'
import { sendMail } from '../services/mailer'
import { sendSMS } from '../services/sms'

export default{
    Query: {
        users: async (_: any, args: any, context: any) => {
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
            const users = await getUsers(args.page, args.take)
            return users
        },
        authUser: async (_: any, args: any, context: any) => {           
            const user = await getUserByField({username: args.account.username}) 
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
                '1h'
                )
            const refreshToken = signUser(
                { id: user.id, username: user.username },
                '1d'
            )
            // set cookie in browser
            await context.res.cookie('jsonwebtoken', refreshToken, {
                path: '/',
                // httpOnly: true,
                sameSite: 'None',
                // secure: true,
                maxAge: 24 * 3600 * 1000

            })
            return {
                user,
                token
            }
        },
        userById: async (_: any, args: any, context: any) => {
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
            const user = await getUserByField({id: args.id})
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
            return user
        },
        findUser: async (_: any, args: any, context: any) => {
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
            const users = await getUserBySearch(args.name)
            return users
        },
        refreshToken: async (_: any, __: any, context: any) => {
            console.dir(context.req.cookies, {depth: null})
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
            
            if (!data || !data.username) {
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
            const user: any = await getUserByField({id: data.id})
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
                '1h'
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
                `,
                user.email
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
            const user = await getUserByField({email: args.email})
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
                <html>
                <p>An email is sent to you to forget password</p>
                <p>${url}</p>
                </html>
                `,
                user.email
            ).catch(error => {
                console.log('error forgot: ', error)
            })
            return `email sent to ${args.email}...`
        },
        resetPassword: async (_: any, args: any) => {
            // validate user
            const user = await getUserByField({id: args.id})
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
        },
        updateCurrentUser: async (_:any, args: any, context: any) => {
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
            const user = await updateUser(args.id, args.data)
            return user
        },
        sendBulkSMS: async (_:any, args: any, context: any) => {
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
            const user = await getUserByField({id: context.user.id})
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
            const numbers = await getContactsByUser(user.id, args.groupName)
            if (!numbers) {
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
            sendSMS(
                numbers.map((num:any)=> num.phone),
                args.message
            )
            return 'message sent'
        },
    }
}
