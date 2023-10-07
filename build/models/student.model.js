"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudent = exports.updateStudentBooking = exports.getFilteredSearchStudents = exports.getFilterStudents = exports.setStudentBooking = exports.setStudentProfile = exports.getStudentById = exports.getAllStudents = exports.createStudent = void 0;
const prisma_1 = require("../services/prisma");
async function createStudent(student) {
    const createStudent = await prisma_1.prisma.student.create({
        data: {
            first_name: student.first_name,
            last_name: student.last_name,
            birthday: student.birthday,
            sex: student.sex,
            parent: {
                connect: {
                    id: student.parentId
                }
            }
        },
        include: {
            profile: true,
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
            profile: true,
            relations: true
        }
    });
    return allStudents;
}
exports.getAllStudents = getAllStudents;
async function getFilterStudents() {
    const allStudents = await prisma_1.prisma.student.findMany({
        where: {
            booking: {
                isNot: null
            }
        },
        include: {
            booking: true,
            parent: true,
            profile: true,
            relations: true
        }
    });
    return allStudents;
}
exports.getFilterStudents = getFilterStudents;
async function getFilteredSearchStudents(word) {
    const allStudents = await prisma_1.prisma.student.findMany({
        where: {
            OR: [
                {
                    first_name: {
                        startsWith: word,
                        mode: 'insensitive'
                    }
                },
                {
                    last_name: {
                        startsWith: word,
                        mode: 'insensitive'
                    }
                }
            ]
        }
    });
    return allStudents;
}
exports.getFilteredSearchStudents = getFilteredSearchStudents;
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
async function setStudentBooking(id, booking) {
    const student = await prisma_1.prisma.student.update({
        where: {
            id
        },
        data: {
            booking: {
                create: booking
            }
        },
        include: {
            booking: true,
            profile: true
        }
    });
    return student;
}
exports.setStudentBooking = setStudentBooking;
async function updateStudentBooking(id, data) {
    const booking = await prisma_1.prisma.booking.update({
        where: {
            studentId: id
        },
        data,
        include: {
            student: true
        }
    });
    return booking;
}
exports.updateStudentBooking = updateStudentBooking;
async function updateStudent(id, data) {
    const student = await prisma_1.prisma.student.update({
        where: {
            id
        },
        data,
        include: {
            booking: true,
            profile: true
        }
    });
    return student;
}
exports.updateStudent = updateStudent;
