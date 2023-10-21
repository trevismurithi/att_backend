"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const student_model_1 = require("../models/student.model");
const parent_model_1 = require("../models/parent.model");
const user_model_1 = require("../models/user.model");
const sms_1 = require("../services/sms");
const graphql_1 = require("graphql");
const utils_services_1 = require("../services/utils.services");
exports.default = {
    Query: {
        students: async (_, args, context) => {
            if (!Object.keys(context.user).length) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const user = await (0, user_model_1.getUserByField)({ id: context.user.id });
            if (!user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            if (user.role === 'ADMIN') {
                return (0, student_model_1.getAllStudents)(args.page, args.take);
            }
            return (0, student_model_1.getAllStudentsByClass)(user.class, args.page, args.take);
        },
        studentBooking: async (_, args, context) => {
            if (!Object.keys(context.user).length) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const user = await (0, user_model_1.getUserByField)({ id: context.user.id });
            if (!user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            if (user.role === 'ADMIN') {
                return (0, student_model_1.getFilterStudents)({
                    booking: {
                        isNot: null
                    },
                }, args.page, args.take);
            }
            return (0, student_model_1.getFilterStudents)({
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
            }, args.page, args.take);
        },
        studentById: async (_, args, context) => {
            if (!Object.keys(context.user).length) {
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
            if (!Object.keys(context.user).length) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const user = await (0, user_model_1.getUserByField)({ id: context.user.id });
            if (!user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            if (user.role === 'ADMIN') {
                return (0, student_model_1.getFilterStudentsBooking)({
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
                });
            }
            return (0, student_model_1.getFilterStudentsBooking)({
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
            });
        },
        studentByName: async (_, args, context) => {
            if (!Object.keys(context.user).length) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const user = await (0, user_model_1.getUserByField)({ id: context.user.id });
            if (!user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            return (0, student_model_1.getFilteredSearchStudents)({
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
            });
        },
    },
    Mutation: {
        createStudent: async (_, args, context) => {
            if (!Object.keys(context.user).length) {
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
            if (!Object.keys(context.user).length) {
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
            if (!Object.keys(context.user).length) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const student = await (0, student_model_1.setStudentBooking)(args.id, args.booking);
            const parent = await (0, parent_model_1.getParentById)(student.parentId);
            if (parent && parent.profile && student && student.booking) {
                const message = `${student.first_name} bus transportation has been created from ${(0, utils_services_1.useDateFormat)(student.booking.from)} - to ${(0, utils_services_1.useDateFormat)(student.booking.to)}`;
                (0, sms_1.sendMTSMSOne)(parent.profile?.phone, message);
            }
            return student;
        },
        updateStudentBooking: async (_, args, context) => {
            if (!Object.keys(context.user).length) {
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
            // find parent of the user
            const parent = await (0, parent_model_1.getParentById)(booking.student.parentId);
            if (parent) {
                (0, sms_1.sendMTSMSOne)(parent.profile?.phone, message);
            }
            return booking;
        },
        updateStudentBookingDates: async (_, args, context) => {
            if (!Object.keys(context.user).length) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            const booking = await (0, student_model_1.updateStudentBooking)(args.id, { status: args.status });
            // send sms to user
            const message = `${booking.student.first_name} bus transportation has been updated from ${(0, utils_services_1.useDateFormat)(booking.from)} - to ${(0, utils_services_1.useDateFormat)(booking.to)}`;
            // find parent of the user
            const parent = await (0, parent_model_1.getParentById)(booking.student.parentId);
            if (parent && parent.profile) {
                (0, sms_1.sendMTSMSOne)(parent.profile?.phone, message);
            }
            return booking;
        },
        updateStudent: async (_, args, context) => {
            if (!Object.keys(context.user).length) {
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
