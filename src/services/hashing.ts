import bcrypt from 'bcrypt'

const saltRounds = 10

function hashing (password: string): string {
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(password, salt)
    return hash
}

function compareHash (password: string, hash: string): Boolean {
    return bcrypt.compareSync(password, hash)
}

export {
    hashing,
    compareHash
}