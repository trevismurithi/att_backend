import { 
    createStudent, 
    getStudentById,
    getAllStudents,
    setStudentProfile,
    setStudentBooking,
    getFilterStudents,
    getFilteredSearchStudents,
    updateStudentBooking,
    updateStudent,
    getFilterStudentsBooking
} from "../models/student.model"

import { sendSMS } from '../services/sms'

import { GraphQLError } from 'graphql'
export default {
    Query: {
        students: async (_: any, args: any, context: any) => {
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
            const studentLimit = await getAllStudents(args.page, args.take)
            return studentLimit
        },
        studentBooking: async (_: any, args: any, context: any) => {
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
            const students = await getFilterStudents(args.page, args.take)
            return students
        },
        studentById: async (_: any, args: any, context: any) => {
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
            const student = await getStudentById(args.id)
            return student
        },
        studentByBooking: async (_: any, args: any, context: any) => {
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
            const students = await getFilterStudentsBooking(args.name)
            return students
        },
        studentByName: async (_: any, args: any, context: any) => {
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
            const students = await getFilteredSearchStudents(args.name)
            return students
        },
    },
    Mutation: {
        createStudent: async (_: any, args: any, context: any) => {
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
            const student = await createStudent(args.student)
            return student
        },
        createProfile: async (_: any, args: any, context: any) => {
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
            const student = await setStudentProfile(args.id, args.profile)
            return student
        },
        createStudentBooking: async (_: any, args: any, context: any) => {
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
            const student = await setStudentBooking(args.id, args.booking)
            return student
        },
        updateStudentBooking: async (_: any, args: any, context: any) => {
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
            const booking = await updateStudentBooking(args.id, {status: args.status})
            // send sms to user
            const message = booking.status === 'PICK'? `${booking.student.first_name} has been picked`:`${booking.student.first_name} has been dropped`
            sendSMS(["+254725844498", "+254724462514"], message,)
            return booking
        },
        updateStudent: async (_: any, args: any, context: any) => {
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
            const student = await updateStudent(args.id, args.data)
            // send sms to user
            return student
        }
    }
}
