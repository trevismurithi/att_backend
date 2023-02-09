import { 
    createStudent, 
    getStudentById,
    getAllStudents,
    setStudentProfile
} from "../models/student.model"

import { GraphQLError } from 'graphql'
export default {
    Query: {
        students: async (_: any, __: any, context: any) => {
            const students = await getAllStudents()
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
            return students
        },
        studentById: async (_: any, args: any, context: any) => {
            const student = await getStudentById(args.id)
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
            return student
        }
    },
    Mutation: {
        createStudent: async (_: any, args: any, context: any) => {
            const student = await createStudent(args.student)
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
            return student
        },
        createProfile: async (_: any, args: any, context: any) => {
            const student = await setStudentProfile(args.id, args.profile)
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
            return student
        }
    }
}
