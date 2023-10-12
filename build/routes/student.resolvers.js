"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const student_model_1 = require("../models/student.model");
const sms_1 = require("../services/sms");
const graphql_1 = require("graphql");
exports.default = {
    Query: {
        students: async (_, args, context) => {
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const studentLimit = await (0, student_model_1.getAllStudents)(args.page, args.take);
            return studentLimit;
        },
        studentBooking: async (_, args, context) => {
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const students = await (0, student_model_1.getFilterStudents)(args.page, args.take);
            return students;
        },
        studentById: async (_, args, context) => {
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const student = await (0, student_model_1.getStudentById)(args.id);
            return student;
        },
        studentByBooking: async (_, args, context) => {
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const students = await (0, student_model_1.getFilterStudentsBooking)(args.name);
            return students;
        },
        studentByName: async (_, args, context) => {
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const students = await (0, student_model_1.getFilteredSearchStudents)(args.name);
            return students;
        },
    },
    Mutation: {
        createStudent: async (_, args, context) => {
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const student = await (0, student_model_1.createStudent)(args.student);
            return student;
        },
        createProfile: async (_, args, context) => {
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const student = await (0, student_model_1.setStudentProfile)(args.id, args.profile);
            return student;
        },
        createStudentBooking: async (_, args, context) => {
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const student = await (0, student_model_1.setStudentBooking)(args.id, args.booking);
            return student;
        },
        updateStudentBooking: async (_, args, context) => {
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const booking = await (0, student_model_1.updateStudentBooking)(args.id, { status: args.status });
            // send sms to user
            const message = booking.status === 'PICK' ? `${booking.student.first_name} has been picked` : `${booking.student.first_name} has been dropped`;
            (0, sms_1.sendSMS)(["+254725844498", "+254724462514"], message);
            return booking;
        },
        updateStudent: async (_, args, context) => {
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const student = await (0, student_model_1.updateStudent)(args.id, args.data);
            // send sms to user
            return student;
        }
    }
};
