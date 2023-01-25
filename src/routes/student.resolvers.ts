import { 
    createStudent, 
    getStudentById,
    getAllStudents,
    setStudentProfile
} from "../models/student.model"

const resolvers = {
    Query: {
        students: () => {
            return getAllStudents()
        },
        studentById: (_: any, args: any) => {
            return getStudentById(args.id)
        }
    },
    Mutation: {
        createStudent: (_: any, args: any) => {
            return createStudent(args.student)
        },
        createProfile (_: any, args: any) {
            return setStudentProfile(args.id, args.profile)
        }
    }
}

export {
    resolvers
}