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

function createManyParents() {
    const parents = []

    for (let index = 0; index < 50; index++) {
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
        }).catch(async () => {
            await prisma.$disconnect()
        })
}

async function createManyStudents() {
    const students: any = []

    for (let index = 0; index < 50; index++) {
        students.push(
            createStudents(
                index + 1,
                [
                    {
                        first_name: faker.name.firstName(),
                        last_name: faker.name.lastName(),
                        birthday: faker.date.birthdate(),
                        sex: faker.name.sex()
                    },
                    {
                        first_name: faker.name.firstName(),
                        last_name: faker.name.lastName(),
                        birthday: faker.date.birthdate(),
                        sex: faker.name.sex()
                    }
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