import { verifyUser } from "./jwt.js"
import { getUserByField } from "../models/user.model.js"

async function validate (req: any) {
    // verify if user
    if (!req.headers.authorization) {
        return false
    }
    const token = req.headers.authorization.split(' ')[1]
    const tokenUser:any = verifyUser(token)
    if (!tokenUser.username) {
        return false
    }

    const user = await getUserByField({username: tokenUser.username})
    if(!user) {
        return false
    }
    return user
}
async function fileFilter (req: any, file:any, cb: any) {
    const state = await validate(req)
    if (!state) {
         cb(new Error('user not authorized'))
        return false
    }
    if (['text/csv'].includes(file.mimetype)) {
        cb(null, state)
    }else {
        cb(null, false)
    }
}

async function adminFileFilter (req: any, file: any, cb: any) {
    // verify is admin
    const state = await validate(req)
    if (!state) {
        cb(new Error('user not authorized'))
        return false
    }
    if (state.role === 'ADMIN') {
        cb(null, true)
    }else {
        cb(null, false)
    }
}

function compareDate (start: string, end: number): number {
    const timeDiff = new Date(end).getTime() - new Date(start).getTime()
    return new Date(timeDiff).getMinutes()
}

export { fileFilter, adminFileFilter, validate, compareDate }