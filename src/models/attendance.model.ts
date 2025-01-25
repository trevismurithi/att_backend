import { profile } from 'console'
import  {prisma}  from '../services/prisma'

async function creatAttendance (studentId:number, date:Date) {
    const attendance = await prisma.studentAttendace.create({
        data: {
            Student: {
                connect: {
                    id: studentId
                }
            },
            date: date
        },
        include: {
            Student: true
        }
    }) // create attendance
    return attendance
}

async function getAttendanceByFilter (where:any, page:number = 1, take: number = 4) {
    const skip = (page - 1) * take
    const attendance = await prisma.studentAttendace.findMany({
        where,
        include: {
            Student: true
        },
        skip,
        take
    }) // get attendance
    const count = await prisma.studentAttendace.count()
    return {attendance, count, page, take}
}

async function getAllAttendance (page:number = 1, take: number = 4) {
    const skip = (page - 1) * take
    const attendance = await prisma.studentAttendace.findMany({
        include: {
            Student: true
        },
        skip,
        take
    }) // get all attendance
    const count = await prisma.studentAttendace.count()
    return {attendance, count, page, take}
}

async function deleteAttendance(id:number) {
    const attendance = await prisma.studentAttendace.deleteMany({
        where: {
            id
        }
    }) // delete all attendance
    return attendance
}

export {
    creatAttendance,
    getAttendanceByFilter,
    getAllAttendance,
    deleteAttendance
}