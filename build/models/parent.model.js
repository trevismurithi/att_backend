"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParent = exports.getFilteredParents = exports.getParentById = exports.setRelationship = exports.getAllParents = exports.createParent = void 0;
const prisma_1 = require("../services/prisma");
async function createParent(parent) {
    const userParent = await prisma_1.prisma.parent.create({
        data: {
            first_name: parent.first_name,
            last_name: parent.last_name,
            email: parent.email,
            sex: parent.sex,
            role: parent.role,
            students: {
                create: {
                    first_name: parent.student.first_name,
                    last_name: parent.student.last_name,
                    birthday: parent.student.birthday,
                    sex: parent.student.sex,
                    profile: {
                        create: {
                            school_name: parent.student.school_name,
                            school_class: parent.student.school_class,
                            sunday_class: parent.student.sunday_class
                        }
                    },
                    relations: {
                        create: {
                            status: parent.student.status,
                            parent: {
                                connect: {
                                    email: parent.email
                                }
                            }
                        }
                    }
                }
            }
        },
        include: {
            profile: true,
            students: true,
            relations: true
        }
    });
    return userParent;
}
exports.createParent = createParent;
async function getParentById(id) {
    const parent = await prisma_1.prisma.parent.findUnique({
        where: {
            id
        },
        include: {
            profile: true,
            students: true,
            relations: true
        }
    });
    return parent;
}
exports.getParentById = getParentById;
async function setRelationship(relation) {
    const relationship = await prisma_1.prisma.parent.update({
        where: { id: relation.id },
        data: {
            relations: {
                create: {
                    status: relation.status,
                    student: {
                        connectOrCreate: {
                            where: {
                                id: relation.student.id
                            },
                            create: {
                                first_name: relation.student.first_name,
                                last_name: relation.student.last_name,
                                birthday: relation.student.birthday,
                                sex: relation.student.sex
                            }
                        }
                    }
                }
            }
        },
        include: {
            students: true,
            relations: true
        }
    });
    return relationship;
}
exports.setRelationship = setRelationship;
async function getAllParents(page = 1, take = 4) {
    const skip = (page - 1) * take;
    const allParents = await prisma_1.prisma.parent.findMany({
        include: {
            profile: true,
            students: true,
            relations: true
        },
        orderBy: {
            updatedAt: 'desc'
        },
        skip,
        take
    });
    const count = await prisma_1.prisma.parent.count();
    return { allParents, count, page, take };
}
exports.getAllParents = getAllParents;
async function getFilteredParents(word, take = 10) {
    const allParents = await prisma_1.prisma.parent.findMany({
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
            profile: true,
            students: true,
            relations: true
        },
        take
    });
    return allParents;
}
exports.getFilteredParents = getFilteredParents;
async function updateParent(id, data) {
    const parent = await prisma_1.prisma.parent.update({
        where: {
            id
        },
        data: {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            sex: data.sex,
            role: data.role,
            profile: {
                upsert: {
                    create: {
                        idCard: data.profile.idCard,
                        phone: data.profile.phone,
                        location: data.profile.location
                    },
                    update: {
                        idCard: data.profile.idCard,
                        phone: data.profile.phone,
                        location: data.profile.location
                    }
                }
            }
        },
        include: {
            profile: true,
            students: true,
            relations: true
        }
    });
    return parent;
}
exports.updateParent = updateParent;
