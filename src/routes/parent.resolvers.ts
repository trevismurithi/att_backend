import { 
    getAllParents, 
    createParent as addParent,
    setRelationship,
    getParentById
} from "../models/parent.model"
import { prisma } from '../services/prisma'

const resolvers = {
    Query: {
        parents: () => {
            return getAllParents()
        },
        parentById: (_: any,args: any) => {
            return getParentById(args.id)
        }
    },
    Mutation: {
        createParent: async (_:any, args: any) => {
            return addParent(args.parent)
        },
        createRelationship: async (_:any, args: any) => {
            return setRelationship(args.relation)
        }
    }
}


export {
    resolvers
}