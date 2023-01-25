import { 
    getUsers,
    getUser,
    getUserById,
    createUser as createNewUser,
    createAttendance
} from "../models/user.model"


const resolvers = {
    Query: {
        users: () => {
            return getUsers()
        },
        authUser: (_: any, args: any) => {
            return getUser(args.account)
        },
        userById: (_: any, args: any) => {
            return getUserById(args.id)
        }
    },
    Mutation: {
        createUser: (_:any, args: any) => {
            return createNewUser(args.account)
        },
        createAttendace: (_: any, args: any) => {
            return createAttendance(args.id, args.studentId)
        }
    }
}


export {
    resolvers
}