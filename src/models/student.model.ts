import { prisma } from '../services/prisma'

async function createStudent (student: any) {
    const createStudent = await prisma.student.create({
        data: {
            first_name: student.first_name,
            last_name: student.last_name,
            birthday: student.birthday,
            sex: student.sex,
        },
        include: {
            parent: true
        }
    })
    return createStudent
}

async function getAllStudents () {
    const allStudents = await prisma.student.findMany({
        include: {
            parent: true,
            relations: true
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

export {
    createStudent,
    getAllStudents,
    getStudentById,
    setStudentProfile
}