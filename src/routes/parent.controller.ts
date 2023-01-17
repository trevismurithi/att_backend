import { prisma } from '../services/prisma'
import { 
    createParent, 
    getAllParents 
} from '../models/parent.model'

function httpCreateParent (req: any, res: any) {
    // TODO: apply small validation
    createParent(req.body).then(async (data) => {
        await prisma.$disconnect()
        return res.json({
            data
        })
    }).catch(async (error) => {
        await prisma.$disconnect()
        return res.json({
            error
        })
    })
}

function httpGetParents (req: any, res: any) {
    getAllParents().then(async (data) => {
        await prisma.$disconnect()
        return res.json({
            data
        })
    }).catch((error) => {
        return res.json({
            error
        })
    })
}

export {
    httpCreateParent,
    httpGetParents
}