"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilterStudentsBooking = exports.updateStudent = exports.updateStudentBooking = exports.getFilteredSearchStudents = exports.getFilterStudents = exports.setStudentBooking = exports.setStudentProfile = exports.getStudentById = exports.getAllStudents = exports.createStudent = void 0;
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
            },
            relations: {
                create: {
                    status: student.status,
                    parent: {
                        connect: {
                            id: student.parentId
                        }
                    }
                }
            },
            profile: {
                create: {
                    school_class: student.school_class,
                    school_name: student.school_name,
                    sunday_class: student.sunday_class
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
async function getAllStudents(page = 1, take = 4) {
    const skip = (page - 1) * take;
    const allStudents = await prisma_1.prisma.student.findMany({
        include: {
            parent: true,
            profile: true,
            relations: true
        },
        orderBy: {
            updatedAt: 'desc'
        },
        skip,
        take
    });
    const count = await prisma_1.prisma.student.count();
    return { allStudents, count, page, take };
}
exports.getAllStudents = getAllStudents;
async function getFilterStudents(page = 1, take = 4) {
    const skip = (page - 1) * take;
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
        },
        skip,
        take
    });
    const count = await prisma_1.prisma.student.count({
        where: {
            booking: {
                isNot: null
            }
        },
    });
    return { allStudents, count, page, take };
}
exports.getFilterStudents = getFilterStudents;
async function getFilterStudentsBooking(word, take = 4) {
    const allStudents = await prisma_1.prisma.student.findMany({
        where: {
            OR: [
                {
                    first_name: {
                        startsWith: word,
                        mode: 'insensitive'
                    },
                    booking: {
                        isNot: null
                    }
                },
                {
                    last_name: {
                        startsWith: word,
                        mode: 'insensitive'
                    },
                    booking: {
                        isNot: null
                    }
                }
            ]
        },
        include: {
            booking: true,
            profile: true,
        },
        take
    });
    return allStudents;
}
exports.getFilterStudentsBooking = getFilterStudentsBooking;
async function getFilteredSearchStudents(word, take = 10) {
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
        },
        include: {
            parent: true,
            profile: true,
            relations: true
        },
        take
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
        data: {
            birthday: data.birthday,
            first_name: data.first_name,
            last_name: data.last_name,
            sex: data.sex,
            profile: {
                upsert: {
                    create: {
                        school_class: data.school_class,
                        sunday_class: data.sunday_class,
                        school_name: data.school_name,
                        image: 'null'
                    },
                    update: {
                        school_class: data.school_class,
                        sunday_class: data.sunday_class,
                        school_name: data.school_name,
                    }
                }
            },
            relations: {
                upsert: {
                    create: {
                        status: data.status,
                        parent: {
                            connect: {
                                id: data.parentId
                            }
                        }
                    },
                    where: {
                        id: data.relationsId
                    },
                    update: {
                        status: data.status
                    }
                }
            }
        },
        include: {
            booking: true,
            profile: true,
            parent: true,
            relations: true
        }
    });
    return student;
}
exports.updateStudent = updateStudent;
