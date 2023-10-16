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
    })
    return createStudent
}

async function getAllStudents (page:number = 1, take: number = 4) {
    const skip = (page - 1) * take
    const allStudents = await prisma.student.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            parent: true,
            profile: true
        },
        skip,
        take
    })
    const count = await prisma.student.count()
    return {allStudents, count, page, take}
}
async function getFilterStudents (page:number = 1, take: number = 4) {
    const skip = (page - 1) * take
    const allStudents = await prisma.student.findMany({
        where: {
            booking: {
                isNot: null
            }
        },
        include: {
            booking: true,
            parent: true,
            profile: true
        },
        skip,
        take
    })
    const count = await prisma.student.count({
        where: {
            booking: {
                isNot: null
            }
        },
    })
    return {allStudents, count, page, take}
}
async function getFilterStudentsBooking (word:string, take: number = 4) {
    const allStudents = await prisma.student.findMany({
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
    })

    return allStudents
}
async function getFilteredSearchStudents (word: string, take: number = 10) {
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
        },
        include: {
            parent: true,
            profile: true
        },
        take
    })
    return allStudents
}

async function getStudentById (id: any) {
    const student = await prisma.student.findUnique({
        where: {
            id
        },
        include: {
            parent: true,
            profile: true,
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
        },
        include: {
            booking: true,
            profile: true,
            parent: true,
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
    updateStudent,
    getFilterStudentsBooking
}