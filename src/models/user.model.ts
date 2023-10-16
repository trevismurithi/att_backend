import { prisma } from "../services/prisma";
import { hashing } from '../services/hashing'

async function createUser(account: any, crypted: string) {

    const userRole = await prisma.user.create({
        data: {
            username: account.username,
            first_name: account.first_name,
            last_name: account.last_name,
            email: account.email,
            class: account.class,
            enabled: false,
            idCard: account.idCard,
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

async function getUsers (page:number = 1, take: number = 4) {
    const skip = (page - 1) * take
    const users = await prisma.user.findMany({
        skip,
        take
    })
    const count = await prisma.user.count()
    return {users, count, page, take}
}

async function getUserByField (field: any) {
    const userRole = await prisma.user.findUnique({
        where: field
    })
    return userRole
}


async function getUserBySearch (word: string, take: number = 10) {
    const users = await prisma.user.findMany({
        where: {
            OR: [
                {
                    username: {
                        startsWith: word,
                        mode: 'insensitive'
                    }
                },
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
        take
    })
    return users
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
    getUserBySearch,
    getUserByField,
    createAttendance,
    createToken,
    deleteToken,
    getTokenById,
    updateUser,
    updateToken
}