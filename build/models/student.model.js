"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setStudentProfile = exports.getStudentById = exports.getAllStudents = exports.createStudent = void 0;
const prisma_1 = require("../services/prisma");
async function createStudent(student) {
    const createStudent = await prisma_1.prisma.student.create({
        data: {
            first_name: student.first_name,
            last_name: student.last_name,
            birthday: student.birthday,
            sex: student.sex,
        },
        include: {
            parent: true
        }
    });
    return createStudent;
}
exports.createStudent = createStudent;
async function getAllStudents() {
    const allStudents = await prisma_1.prisma.student.findMany({
        include: {
            parent: true,
            relations: true
        }
    });
    return allStudents;
}
exports.getAllStudents = getAllStudents;
async function getStudentById(id) {
    const student = await prisma_1.prisma.student.findUnique({
        where: {
            id
        },
        include: {
            parent: true
        }
    });
    return student;
}
exports.getStudentById = getStudentById;
async function setStudentProfile(id, profile) {
    const student = await prisma_1.prisma.student.update({
        where: {
            id
        },
        data: {
            profile: {
                create: {
                    school_name: profile.school_name,
                    school_class: profile.school_class,
                    sunday_class: profile.sunday_class
                }
            }
        },
        include: {
            profile: true
        }
    });
    return student;
}
exports.setStudentProfile = setStudentProfile;
