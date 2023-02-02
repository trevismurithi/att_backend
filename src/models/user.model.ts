import { prisma } from "../services/prisma";
import { hashing, compareHash } from '../services/hashing'

async function createUser(account: any, crypted: string) {

    const userRole = await prisma.user.create({
        data: {
            username: account.username,
            first_name: account.first_name,
            last_name: account.last_name,
            email: account.email,
            class: account.class,
            enabled: false,
            birthday: account.birthday,
            password: hashing(account.password),
            token: {
                create: {
                    token: crypted
                }
            }
        }
    })
    return userRole
}

async function getUsers () {
    const users = await prisma.user.findMany()
    return users
}

async function getUserById (id: number) {
    const userRole = await prisma.user.findUnique({
        where: {
            id
        }
    })
    return userRole
}

async function getUserByEmail(email: string) {
    const userRole = await prisma.user.findUnique({
        where: {
            email
        }
    })
    return userRole
}

async function getUser (account: any) {
    const userRole: any = await prisma.user.findUnique({
        where: {
            username: account.username,
        }
    })
    if (!compareHash(account.password, userRole?.password)) {
        throw new Error("Invalid credentials");
    }
    return userRole
}

async function createAttendance(id: number, studentId: number) {
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

async function createToken (crypted: string, id: number) {
    const user = await prisma.user.update({
        where: {
            id
        },
        data: {
            token: {
                create: {
                    token: crypted
                }
            }
        }
    })
    return user
}

async function getTokenById(id: number) {
    const findToken = await prisma.token.findFirst({
        where: {
            userId: id
        }
    })
    if (!findToken) {
        return null
    }
    return findToken
}

async function updateToken (id: number, crypt: string) {
    const token = await prisma.token.upsert({
        where: {
            userId: id
        },
        update: {
            token: crypt
        },
        create: {
            token: crypt,
            user: {
                connect: {
                    id
                }
            }
        }
    })
    return token
}

async function deleteToken (id: number) {
    const deletedToken = await prisma.token.delete({
        where: {
            userId: id
        }
    })
    return deletedToken
}

async function updateUser (id: number, body: any) {
    const user = await prisma.user.update({
        where: {
            id
        },
        data: body
    })
    return user
}

export {
    createUser,
    getUsers,
    getUser,
    getUserById,
    createAttendance,
    createToken,
    deleteToken,
    getTokenById,
    updateUser,
    getUserByEmail,
    updateToken
}