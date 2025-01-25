"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const user_model_1 = require("../models/user.model");
const attendance_model_1 = require("../models/attendance.model");
exports.default = {
    Query: {
        studentAttendances: async (parent, args, context, info) => {
            const user = await getAuthUser(context);
            let filter = {};
            if (args.filter) {
                if (args.filter.studentId) {
                    filter.Student.id = args.filter.studentId;
                }
                if (args.filter.date) {
                    const data = {
                        createdAt: {
                            gte: args.filter.date,
                        },
                    };
                    filter = Object.assign(filter, data);
                }
                if (args.filter.sunday_class) {
                    const data = {
                        Student: {
                            profile: {
                                sunday_class: args.filter.sunday_class,
                            },
                        },
                    };
                    filter = Object.assign(filter, data);
                }
            }
            if (user.role === "ADMIN") {
                if (Object.keys(filter).length > 0) {
                    return (0, attendance_model_1.getAttendanceByFilter)(filter, args.page, args.take);
                }
                return (0, attendance_model_1.getAllAttendance)(args.page, args.take);
            }
            const data = {
                Student: {
                    profile: {
                        sunday_class: user.class
                    },
                },
            };
            filter = Object.assign(filter, data);
            return (0, attendance_model_1.getAttendanceByFilter)(filter, args.page, args.take);
        },
        studentAttendanceById: async (parent, args, context, info) => {
            await getAuthUser(context);
            return (0, attendance_model_1.getAttendanceByFilter)({ id: args.id }, 1, 1);
        },
    },
    Mutation: {
        createStudentAttendance: async (parent, args, context, info) => {
            await getAuthUser(context);
            args.attendance.studentIds.forEach(async (id) => {
                try {
                    await (0, attendance_model_1.creatAttendance)(id, args.attendance.date);
                }
                catch (error) {
                    console.error(error, id);
                }
            });
            return 'created';
        },
        deleteStudentAttendance: async (parent, args, context, info) => {
            await getAuthUser(context);
            return (0, attendance_model_1.deleteAttendance)(args.id);
        },
    },
};
async function getAuthUser(context) {
    if (!Object.keys(context.user).length) {
        throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
            extensions: {
                code: "FORBIDDEN",
                http: { status: 401 },
            },
        });
    }
    const user = await (0, user_model_1.getUserByField)({ id: context.user.id });
    if (!user) {
        throw new graphql_1.GraphQLError("You are not authorized to perform this action", {
            extensions: {
                code: "FORBIDDEN",
                http: { status: 401 },
            },
        });
    }
    return user;
}
