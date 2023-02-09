"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const student_model_1 = require("../models/student.model");
const graphql_1 = require("graphql");
const resolvers = {
    Query: {
        students: async (_, __, context) => {
            const students = await (0, student_model_1.getAllStudents)();
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            return students;
        },
        studentById: async (_, args, context) => {
            const student = await (0, student_model_1.getStudentById)(args.id);
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            return student;
        }
    },
    Mutation: {
        createStudent: async (_, args, context) => {
            const student = await (0, student_model_1.createStudent)(args.student);
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            return student;
        },
        createProfile: async (_, args, context) => {
            const student = await (0, student_model_1.setStudentProfile)(args.id, args.profile);
            if (!context.user) {
                throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
                    extensions: {
                        code: 'FORBIDDEN',
                        http: { status: 401 }
                    }
                });
            }
            return student;
        }
    }
};
exports.default = resolvers;
