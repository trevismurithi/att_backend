import { prisma } from '../services/prisma'

async function createParent(parent: any) {
    const userParent = await prisma.parent.create({
        data: {
            first_name: parent.first_name,
            last_name: parent.last_name,
            age: parent.age,
            email: parent.email,
            sex: parent.sex,
            role: parent.role,
            students: {
                create: [
                    {
                        first_name: parent.student.first_name,
                        last_name: parent.student.last_name,
                        age: parent.student.age,
                        birthday: parent.student.birthday,
                        sex: parent.student.sex
                    }
                ]
            }
        },
        include: {
            students: true,
            relations: true
        }
    })
    return userParent
}

async function getParentById (id: any) {
    const parent = await prisma.parent.findUnique({
        where: {
            id
        },
        include: {
            relations: true
        }
    })
    return parent
}
async function setRelationship(relation: any) {
    const relationship = await prisma.parent.update({
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
                                age: relation.student.age,
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
    })

    return relationship
}

async function getAllParents() {
    const allParents = await prisma.parent.findMany({
        include: {
            students: true,
            relations: true
        }
    })
    return allParents
}

export {
    createParent,
    getAllParents,
    setRelationship,
    getParentById
}