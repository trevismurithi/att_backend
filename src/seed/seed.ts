import { prisma, Role } from '../services/prisma'
import { faker } from '@faker-js/faker'
async function createParents(parents: any) {
    await prisma.parent.createMany({
        data: parents,
    })
}

async function createStudents(id: any, students: any) {
    return prisma.parent.update({
        where: {
            id
        },
        data: {
            students: {
                create: students
            }
        }

    })
}

async function updateParentProfile(){
    for (let index = 0; index < 100; index++) {
        await prisma.parent.update({
            where: {
                id: index +1 
            },
            data: {
                profile: {
                    create: {
                        idCard: faker.company.name(),
                        phone: faker.phone.number(),
                        location: faker.address.city()
                    }
                },
                // relations: {
                //     create: {
                //         status: 'PARENT',
                //         student: {
                //             connect: {
                //                 id: index+1
                //             },
                //         }
                //     }
                // }
            }
        })
        // await prisma.parent.update({
        //     where: {
        //         id: index +1 
        //     },
        //     data: {
        //         relations: {
        //             create: {
        //                 status: 'PARENT',
        //                 student: {
        //                     connect: {
        //                         id: index+2
        //                     },
        //                 }
        //             }
        //         }
        //     }
        // })
    }
    for (let index = 0; index < 100; index++) {
        await prisma.student.update({
            where: {
                id: index + 1
            },
            data: {
                profile: {
                    create: {
                        school_name: 'Junior School',
                        school_class: faker.animal.bird(),
                        sunday_class: faker.animal.bear()
                    }
                },
                relations: {
                    create: {
                        status: 'PARENT',
                        parent: {
                            connect: {
                                id: index+1
                            }
                        }
                    }
                }
            }
        })
    }
}

function createManyParents() {
    const parents = []

    for (let index = 0; index < 100; index++) {
        parents.push(
            {
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                email: faker.internet.email(),
                sex: faker.name.sex(),
                role: Role.PARENT,
            }
        )
    }
    createParents(parents)
        .then(async () => {
            await createManyStudents()
            await updateParentProfile()
        }).catch(async () => {
            await prisma.$disconnect()
        })
}

async function createManyStudents() {
    const students: any = []

    for (let index = 0; index < 100; index++) {
        students.push(
            createStudents(
                index + 1,
                [
                    {
                        first_name: faker.name.firstName(),
                        last_name: faker.name.lastName(),
                        birthday: faker.date.birthdate(),
                        sex: faker.name.sex(),
                        // profile: {
                        //     create: {
                        //         school_name: faker.word.noun() + 'School',
                        //         school_class: faker.animal.bird(),
                        //         sunday_class: faker.animal.bear()
                        //     }
                        // },
                        // relations: [
                        //     {
                        //         create: {
                        //             status: 'PARENT',
                        //             parent: {
                        //                 connect: {
                        //                     id: index + 1
                        //                 }
                        //             }
                        //         }
                        //     }
                        // ]
                    },
                    // {
                    //     first_name: faker.name.firstName(),
                    //     last_name: faker.name.lastName(),
                    //     birthday: faker.date.birthdate(),
                    //     sex: faker.name.sex(),
                    //     profile: {
                    //         create: {
                    //             school_name: faker.word.noun() + 'School',
                    //             school_class: faker.animal.bird(),
                    //             sunday_class: faker.animal.bear()
                    //         }
                    //     },
                    //     relations: [
                    //         {
                    //             create: {
                    //                 status: 'PARENT',
                    //                 parent: {
                    //                     connect: {
                    //                         id: index + 1
                    //                     }
                    //                 }
                    //             }
                    //         }
                    //     ]
                    // }
                ]
            )
        )
    }
    await prisma.$transaction(students)
        .then(async () => {
            await prisma.$disconnect()
        }).catch(async () => {
            await prisma.$disconnect()
        })
}
createManyParents()