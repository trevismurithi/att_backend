import { prisma } from '../services/prisma'

async function createStudent (student: any) {
    const createStudent = await prisma.student.create({
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
    })
    return createStudent
}

async function getAllStudents () {
    const allStudents = await prisma.student.findMany({
        include: {
            parent: true,
            profile: true,
            relations: true
        }
    })
    return allStudents
}
async function getFilterStudents () {
    const allStudents = await prisma.student.findMany({
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
    })
    return allStudents
}

async function getFilteredSearchStudents (word: string) {
    const allStudents = await prisma.student.findMany({
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
    })
    return allStudents
}

async function getStudentById (id: any) {
    const student = await prisma.student.findUnique({
        where: {
            id
        },
        include: {
            parent: true
        }
    })
    return student
}

async function setStudentProfile (id: any, profile: any) {
    const student = await prisma.student.update({
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
    })
    return student
}

async function setStudentBooking (id: number, booking: any) {
    const student = await prisma.student.update({
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
    })
    return student
}
async function updateStudentBooking (id: number, data: any) {
    const booking = await prisma.booking.update({
        where: {
            studentId: id
        },
        data,
        include: {
            student: true
        }
    })
    return booking
}

async function updateStudent (id: number, data: any) {
    const student = await prisma.student.update({
        where: {
            id
        },
        data,
        include: {
            booking: true,
            profile: true
        }
    })
    return student
}
export {
    createStudent,
    getAllStudents,
    getStudentById,
    setStudentProfile,
    setStudentBooking,
    getFilterStudents,
    getFilteredSearchStudents,
    updateStudentBooking,
    updateStudent
}