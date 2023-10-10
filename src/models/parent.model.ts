import { prisma } from '../services/prisma'

async function createParent(parent: any) {
    const userParent = await prisma.parent.create({
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
    })
    return userParent
}

async function getParentById (id: any) {
    const parent = await prisma.parent.findUnique({
        where: {
            id
        },
        include: {
            profile: true,
            students: true,
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

async function getAllParents(page:number = 1, take: number = 4) {
    const skip = (page - 1) * take
    const allParents = await prisma.parent.findMany({
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
    })
    const count = await prisma.parent.count()
    return {allParents, count, page, take}
}

async function getFilteredParents (word: string, take: number = 10) {
    const allParents = await prisma.parent.findMany({
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
    })
    return allParents
}

async function updateParent (id: number, data: any) {
    const parent = await prisma.parent.update({
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
                        birthday: data.profile.birthday,
                        phone: data.profile.phone,
                        location: data.profile.location
                    },
                    update: {
                        birthday: data.profile.birthday,
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
    })
    return parent
}

export {
    createParent,
    getAllParents,
    setRelationship,
    getParentById,
    getFilteredParents,
    updateParent
}