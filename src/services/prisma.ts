import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

export { prisma, Role }