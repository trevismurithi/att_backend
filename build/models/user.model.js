"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateToken = exports.getUserByEmail = exports.updateUser = exports.getTokenById = exports.deleteToken = exports.createToken = exports.createAttendance = exports.getUserById = exports.getUser = exports.getUsers = exports.createUser = void 0;
const prisma_1 = require("../services/prisma");
const hashing_1 = require("../services/hashing");
async function createUser(account, crypted) {
    const userRole = await prisma_1.prisma.user.create({
        data: {
            username: account.username,
            first_name: account.first_name,
            last_name: account.last_name,
            email: account.email,
            class: account.class,
            enabled: false,
            birthday: account.birthday,
            password: (0, hashing_1.hashing)(account.password),
            token: {
                create: {
                    token: crypted
                }
            }
        }
    });
    return userRole;
}
exports.createUser = createUser;
async function getUsers() {
    const users = await prisma_1.prisma.user.findMany();
    return users;
}
exports.getUsers = getUsers;
async function getUserById(id) {
    const userRole = await prisma_1.prisma.user.findUnique({
        where: {
            id
        }
    });
    return userRole;
}
exports.getUserById = getUserById;
async function getUserByEmail(email) {
    const userRole = await prisma_1.prisma.user.findUnique({
        where: {
            email
        }
    });
    return userRole;
}
exports.getUserByEmail = getUserByEmail;
async function getUser(account) {
    const userRole = await prisma_1.prisma.user.findUnique({
        where: {
            username: account.username,
        }
    });
    if (!(0, hashing_1.compareHash)(account.password, userRole?.password)) {
        throw new Error("Invalid credentials");
    }
    return userRole;
}
exports.getUser = getUser;
async function createAttendance(id, studentId) {
    const present = await prisma_1.prisma.user.update({
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
    });
    return present;
}
exports.createAttendance = createAttendance;
async function createToken(crypted, id) {
    const user = await prisma_1.prisma.user.update({
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
    });
    return user;
}
exports.createToken = createToken;
async function getTokenById(id) {
    const findToken = await prisma_1.prisma.token.findFirst({
        where: {
            userId: id
        }
    });
    if (!findToken) {
        return null;
    }
    return findToken;
}
exports.getTokenById = getTokenById;
async function updateToken(id, crypt) {
    const token = await prisma_1.prisma.token.upsert({
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
    });
    return token;
}
exports.updateToken = updateToken;
async function deleteToken(id) {
    const deletedToken = await prisma_1.prisma.token.delete({
        where: {
            userId: id
        }
    });
    return deletedToken;
}
exports.deleteToken = deleteToken;
async function updateUser(id, body) {
    const user = await prisma_1.prisma.user.update({
        where: {
            id
        },
        data: body
    });
    return user;
}
exports.updateUser = updateUser;
