import { prisma } from "../services/prisma";

async function createUser (account: any) {
    const userRole = await prisma.user.create({
        data: {
            username: account.username,
            email: account.email,
            role: account.role,
            birthday: account.birthday,
            class: account.class,
            password: account.password
        }
    })
    return userRole
}

async function getUsers () {
    const users = await prisma.user.findMany()
    return users
}

async function getUserById (id: any) {
    const userRole = await prisma.user.findUnique({
        where: {
            id
        }
    })
    return userRole
}

async function getUser (account: any) {
    const userRole = await prisma.user.findFirst({
        where: {
            username: account.username,
            password: account.password
        }
    })
    return userRole
}

async function createAttendance(id: any, studentId: any) {
    const present = await prisma.user.update({
        where: {
            id
        },
        data: {
            attendance: {
                create: {
                    student: {
                        connect: {
                            id: studentId
                        }
                    }
                }
            }
        },
        include: {
            attendance: true
        }
    })
    return present
}

export {
    createUser,
    getUsers,
    getUser,
    getUserById,
    createAttendance
}