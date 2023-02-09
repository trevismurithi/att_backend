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
function createManyParents() {
    const parents = [];
    for (let index = 0; index < 50; index++) {
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
    }).catch(async () => {
        await prisma_1.prisma.$disconnect();
    });
}
async function createManyStudents() {
    const students = [];
    for (let index = 0; index < 50; index++) {
        students.push(createStudents(index + 1, [
            {
                first_name: faker_1.faker.name.firstName(),
                last_name: faker_1.faker.name.lastName(),
                birthday: faker_1.faker.date.birthdate(),
                sex: faker_1.faker.name.sex()
            },
            {
                first_name: faker_1.faker.name.firstName(),
                last_name: faker_1.faker.name.lastName(),
                birthday: faker_1.faker.date.birthdate(),
                sex: faker_1.faker.name.sex()
            }
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
