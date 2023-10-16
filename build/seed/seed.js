"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../services/prisma");
const faker_1 = require("@faker-js/faker");
async function createParents(parents) {
    await prisma_1.prisma.parent.createMany({
        data: parents,
    });
}
async function createStudents(id, students) {
    return prisma_1.prisma.parent.update({
        where: {
            id
        },
        data: {
            students: {
                create: students
            }
        }
    });
}
async function updateParentProfile() {
    for (let index = 0; index < 100; index++) {
        await prisma_1.prisma.parent.update({
            where: {
                id: index + 1
            },
            data: {
                profile: {
                    create: {
                        idCard: faker_1.faker.company.name(),
                        phone: faker_1.faker.phone.number(),
                        location: faker_1.faker.address.city()
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
        });
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
        await prisma_1.prisma.student.update({
            where: {
                id: index + 1
            },
            data: {
                profile: {
                    create: {
                        school_name: 'Junior School',
                        school_class: faker_1.faker.animal.bird(),
                        sunday_class: faker_1.faker.animal.bear()
                    }
                },
                relations: {
                    create: {
                        status: 'PARENT',
                        parent: {
                            connect: {
                                id: index + 1
                            }
                        }
                    }
                }
            }
        });
    }
}
function createManyParents() {
    const parents = [];
    for (let index = 0; index < 100; index++) {
        parents.push({
            first_name: faker_1.faker.name.firstName(),
            last_name: faker_1.faker.name.lastName(),
            email: faker_1.faker.internet.email(),
            sex: faker_1.faker.name.sex(),
            role: prisma_1.Role.PARENT,
        });
    }
    createParents(parents)
        .then(async () => {
        await createManyStudents();
        await updateParentProfile();
    }).catch(async () => {
        await prisma_1.prisma.$disconnect();
    });
}
async function createManyStudents() {
    const students = [];
    for (let index = 0; index < 100; index++) {
        students.push(createStudents(index + 1, [
            {
                first_name: faker_1.faker.name.firstName(),
                last_name: faker_1.faker.name.lastName(),
                birthday: faker_1.faker.date.birthdate(),
                sex: faker_1.faker.name.sex(),
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
        ]));
    }
    await prisma_1.prisma.$transaction(students)
        .then(async () => {
        await prisma_1.prisma.$disconnect();
    }).catch(async () => {
        await prisma_1.prisma.$disconnect();
    });
}
createManyParents();
