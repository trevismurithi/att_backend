import { prisma } from '../services/prisma'

async function createStudent (student: any) {
    const createStudent = await prisma.student.create({
        data: {
            first_name: student.first_name,
            last_name: student.last_name,
            age: student.age,
            birthday: student.birthday,
            sex: student.sex,
            parent: {
                create: {
                    first_name: student.parent.first_name,
                    last_name: student.parent.last_name,
                    age: student.parent.age,
                    email: student.parent.email,
                    sex: student.parent.sex,
                    role: student.parent.role
                }
            }
        }
    })
}