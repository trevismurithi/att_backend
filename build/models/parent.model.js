"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParentById = exports.setRelationship = exports.getAllParents = exports.createParent = void 0;
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
                    sex: parent.student.sex
                }
            }
        },
        include: {
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
async function getAllParents() {
    const allParents = await prisma_1.prisma.parent.findMany({
        include: {
            students: true,
            relations: true
        }
    });
    return allParents;
}
exports.getAllParents = getAllParents;
