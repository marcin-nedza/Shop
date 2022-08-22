import { injectable } from "inversify";
import {PrismaClient, } from "@prisma/client"

const prisma = new PrismaClient()
@injectable()
export class DBContext {
    public async connect() {
         await prisma.$connect()
         console.log('Connected to prisma')
    }
    public get models(){
        return prisma
    }
}