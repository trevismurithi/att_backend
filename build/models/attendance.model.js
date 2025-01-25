"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAttendance = exports.getAllAttendance = exports.getAttendanceByFilter = exports.creatAttendance = void 0;
const prisma_1 = require("../services/prisma");
async function creatAttendance(studentId, date) {
    const attendance = await prisma_1.prisma.studentAttendace.create({
        data: {
            Student: {
                connect: {
                    id: studentId
                }
            },
            date: date
        },
        include: {
            Student: true
        }
    }); // create attendance
    return attendance;
}
exports.creatAttendance = creatAttendance;
async function getAttendanceByFilter(where, page = 1, take = 4) {
    const skip = (page - 1) * take;
    const attendance = await prisma_1.prisma.studentAttendace.findMany({
        where,
        include: {
            Student: true
        },
        skip,
        take
    }); // get attendance
    const count = await prisma_1.prisma.studentAttendace.count();
    return { attendance, count, page, take };
}
exports.getAttendanceByFilter = getAttendanceByFilter;
async function getAllAttendance(page = 1, take = 4) {
    const skip = (page - 1) * take;
    const attendance = await prisma_1.prisma.studentAttendace.findMany({
        include: {
            Student: true
        },
        skip,
        take
    }); // get all attendance
    const count = await prisma_1.prisma.studentAttendace.count();
    return { attendance, count, page, take };
}
exports.getAllAttendance = getAllAttendance;
async function deleteAttendance(id) {
    const attendance = await prisma_1.prisma.studentAttendace.deleteMany({
        where: {
            id
        }
    }); // delete all attendance
    return attendance;
}
exports.deleteAttendance = deleteAttendance;
