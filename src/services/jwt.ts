import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

function signUser (payload: Object) {
    const secret: any = process.env.SECRET_KEY
    return jwt.sign(payload, secret, {
        expiresIn: '1h',
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
}

export {
    signUser,
    verifyUser
}