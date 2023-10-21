import {
    createStudent,
    getStudentById,
    getAllStudents,
    getAllStudentsByClass,
    setStudentProfile,
    setStudentBooking,
    getFilterStudents,
    getFilteredSearchStudents,
    updateStudentBooking,
    updateStudent,
    getFilterStudentsBooking
} from "../models/student.model"
import { getParentById } from "../models/parent.model";
import { getUserByField } from "../models/user.model";
import { sendMTSMSOne } from '../services/sms'
import { GraphQLError } from 'graphql'
import { useDateFormat } from "../services/utils.services";

export default {
    Query: {
        students: async (_: any, args: any, context: any) => {
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
            const user: any = await getUserByField({ id: context.user.id })
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
                return getAllStudents(args.page, args.take)
            }
            return getAllStudentsByClass(user.class, args.page, args.take)
        },
        studentBooking: async (_: any, args: any, context: any) => {
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
            const user: any = await getUserByField({ id: context.user.id })
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
                return getFilterStudents({
                    booking: {
                        isNot: null
                    },
                },
                    args.page,
                    args.take
                )
            }
            return getFilterStudents(
                {
                    AND: [
                        {
                            booking: {
                                isNot: null
                            },
                        },
                        {
                            profile: {
                                school_class: user.class
                            }
                        }
                    ]
                }, args.page, args.take)
        },
        studentById: async (_: any, args: any, context: any) => {
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
            const student = await getStudentById(args.id)
            return student
        },
        studentByBooking: async (_: any, args: any, context: any) => {
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
            const user: any = await getUserByField({ id: context.user.id })
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
                return getFilterStudentsBooking({
                    OR: [
                        {
                            first_name: {
                                startsWith: args.name,
                                mode: 'insensitive'
                            },
                            booking: {
                                isNot: null
                            },
                        },
                        {
                            last_name: {
                                startsWith: args.name,
                                mode: 'insensitive'
                            },
                            booking: {
                                isNot: null
                            },
                        }
                    ]
                })
            }
            return getFilterStudentsBooking({
                OR: [
                    {
                        first_name: {
                            startsWith: args.name,
                            mode: 'insensitive'
                        },
                        booking: {
                            isNot: null
                        },
                        profile: {
                            school_class: user.class
                        }
                    },
                    {
                        last_name: {
                            startsWith: args.name,
                            mode: 'insensitive'
                        },
                        booking: {
                            isNot: null
                        },
                        profile: {
                            school_class: user.class
                        }
                    }
                ]
            })
        },
        studentByName: async (_: any, args: any, context: any) => {
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
            const user: any = await getUserByField({ id: context.user.id })
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

            return getFilteredSearchStudents({
                OR: [
                    {
                        first_name: {
                            startsWith: args.name,
                            mode: 'insensitive'
                        },
                    },
                    {
                        last_name: {
                            startsWith: args.name,
                            mode: 'insensitive'
                        },
                    }
                ]
            })
        },
    },
    Mutation: {
        createStudent: async (_: any, args: any, context: any) => {
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
            const student = await createStudent(args.student)
            return student
        },
        createProfile: async (_: any, args: any, context: any) => {
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
            const student = await setStudentProfile(args.id, args.profile)
            return student
        },
        createStudentBooking: async (_: any, args: any, context: any) => {
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
            const student = await setStudentBooking(args.id, args.booking)
            const parent = await getParentById(student.parentId)
            if(parent && parent.profile && student && student.booking) {
                const message = `${student.first_name} bus transportation has been created from ${useDateFormat(student.booking.from)} - to ${useDateFormat(student.booking.to)}`
                sendMTSMSOne(parent.profile?.phone, message)
            }
            return student
        },
        updateStudentBooking: async (_: any, args: any, context: any) => {
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
            const booking = await updateStudentBooking(args.id, { status: args.status })
            // send sms to user
            const message = booking.status === 'PICK' ? `${booking.student.first_name} has been picked` : `${booking.student.first_name} has been dropped`
            // find parent of the user
            const parent = await getParentById(booking.student.parentId)
            if (parent) {
                sendMTSMSOne(parent.profile?.phone, message,)
            }            
            return booking
        },
        updateStudentBookingDates: async (_: any, args: any, context: any) => {
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
            const booking = await updateStudentBooking(args.id, { status: args.status })
            // send sms to user
            const message = `${booking.student.first_name} bus transportation has been updated from ${useDateFormat(booking.from)} - to ${useDateFormat(booking.to)}`
            // find parent of the user
            const parent = await getParentById(booking.student.parentId)
            if (parent && parent.profile) {
                sendMTSMSOne(parent.profile?.phone, message)
            }            
            return booking
        },
        updateStudent: async (_: any, args: any, context: any) => {
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
            const student = await updateStudent(args.id, args.data)
            // send sms to user
            return student
        }
    }
}
