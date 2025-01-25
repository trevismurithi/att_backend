import { GraphQLError } from "graphql";
import { getAttendance, getUserByField } from "../models/user.model";
import { get } from "http";
import {
  creatAttendance,
  deleteAttendance,
  getAllAttendance,
  getAttendanceByFilter,
} from "../models/attendance.model";
import { create } from "domain";

export default {
  Query: {
    studentAttendances: async (parent: any, args: any, context: any, info: any) => {
      const user: any = await getAuthUser(context);
      let filter: any = {};
      if (args.filter) {
        if (args.filter.studentId) {
          filter.Student.id = args.filter.studentId;
        }
        if (args.filter.date) {
          const data = {
            createdAt: {
              gte: args.filter.date,
            },
          }
          filter= Object.assign(filter, data);
        }
        if (args.filter.sunday_class) {
          const data = {
            Student: {
              profile: {
                sunday_class: args.filter.sunday_class,
              },
            },
          }
          filter = Object.assign(filter, data);
        }
      }
      if (user.role === "ADMIN") {
        if (Object.keys(filter).length > 0) {
          return getAttendanceByFilter(filter, args.page, args.take);
        }
        return getAllAttendance(args.page, args.take);
      }
      const data = {
        Student: {
          profile: {
            sunday_class: user.class
          },
        },
      }
      filter = Object.assign(filter, data);
      return getAttendanceByFilter(filter, args.page, args.take);
    },
    studentAttendanceById: async (parent: any, args: any, context: any, info: any) => {
      await getAuthUser(context);
      return getAttendanceByFilter({ id: args.id }, 1, 1);
    },
  },
  Mutation: {
    createStudentAttendance: async (
      parent: any,
      args: any,
      context: any,
      info: any
    ) => {
      await getAuthUser(context);
      args.attendance.studentIds.forEach(async (id: number) => {
        try {
          await creatAttendance(id, args.attendance.date);
        } catch (error) {
         console.error(error, id) 
        }
      });
      return 'created';
    },
    deleteStudentAttendance: async (
      parent: any,
      args: any,
      context: any,
      info: any
    ) => {
      await getAuthUser(context);
      return deleteAttendance(args.id);
    },
  },
};

async function getAuthUser(context: any) {
  if (!Object.keys(context.user).length) {
    throw new GraphQLError("You are not authorized to perform this action", {
      extensions: {
        code: "FORBIDDEN",
        http: { status: 401 },
      },
    });
  }
  const user: any = await getUserByField({ id: context.user.id });
  if (!user) {
    throw new GraphQLError("You are not authorized to perform this action", {
      extensions: {
        code: "FORBIDDEN",
        http: { status: 401 },
      },
    });
  }
  return user;
}
