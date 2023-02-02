import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

function signUser(payload: Object, expiresIn: string) {
    const secret: any = process.env.SECRET_KEY
    return jwt.sign(payload, secret, {
        expiresIn
    })
}

function verifyUser (token: any) {
    const secret: any = process.env.SECRET_KEY
    jwt.verify(token, secret, function (err: any, decoded: any) {
        if (err) {
            return undefined
        }
        return decoded
    })
    return undefined
}

function compareDate (start: string, end: number): number {
    const timeDiff = new Date(end).getTime() - new Date(start).getTime()
    return new Date(timeDiff).getMinutes()
}

export {
    signUser,
    verifyUser,
    compareDate
}