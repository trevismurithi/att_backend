"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttendance = exports.deleteGroup = exports.getContactsByUser = exports.updateToken = exports.updateUser = exports.getTokenById = exports.deleteToken = exports.createToken = exports.createAttendance = exports.getUserByField = exports.getUserBySearch = exports.getUsers = exports.createUser = void 0;
const prisma_1 = require("../services/prisma");
const hashing_1 = require("../services/hashing");
async function createUser(account, crypted) {
    const userRole = await prisma_1.prisma.user.create({
        data: {
            username: account.username,
            first_name: account.first_name,
            last_name: account.last_name,
            role: account.role,
            email: account.email,
            class: account.class,
            enabled: false,
            idCard: account.idCard,
            password: (0, hashing_1.hashing)(account.password),
            token: {
                create: {
                    token: crypted
                }
            },
            wallet: {
                create: {
                    amount: 0
                }
            }
        },
    });
    return userRole;
}
exports.createUser = createUser;
async function getUsers(page = 1, take = 4) {
    const skip = (page - 1) * take;
    const users = await prisma_1.prisma.user.findMany({
        skip,
        take
    });
    const count = await prisma_1.prisma.user.count();
    return { users, count, page, take };
}
exports.getUsers = getUsers;
async function getUserByField(field) {
    const userRole = await prisma_1.prisma.user.findUnique({
        where: field,
        include: {
            groups: true,
            wallet: true
        }
    });
    return userRole;
}
exports.getUserByField = getUserByField;
async function getUserBySearch(word, take = 10) {
    const users = await prisma_1.prisma.user.findMany({
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
    });
    return users;
}
exports.getUserBySearch = getUserBySearch;
async function getAttendance(page = 1, take = 4) {
    const skip = (page - 1) * take;
    const attendace = await prisma_1.prisma.attendace.findMany({
        skip,
        take
    });
    const count = await prisma_1.prisma.attendace.count();
    return { attendace, count, page, take };
}
exports.getAttendance = getAttendance;
async function createAttendance(id, total) {
    const user = await prisma_1.prisma.user.update({
        where: {
            id
        },
        data: {
            attendance: {
                create: {
                    total
                }
            }
        },
        include: {
            attendance: true
        }
    });
    return user;
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
        data: body,
        include: {
            groups: true,
            wallet: true
        }
    });
    return user;
}
exports.updateUser = updateUser;
async function getContactsByUser(id, group) {
    const contacts = await prisma_1.prisma.contacts.findMany({
        where: {
            group: {
                name: group,
                user: {
                    id
                }
            }
        },
        select: {
            phone: true
        }
    });
    return contacts;
}
exports.getContactsByUser = getContactsByUser;
async function deleteGroup(id) {
    const group = await prisma_1.prisma.group.delete({
        where: {
            id
        }
    });
    return group;
}
exports.deleteGroup = deleteGroup;
