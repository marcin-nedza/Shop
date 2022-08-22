import { PrismaClientValidationError } from "@prisma/client/runtime";

export class ValidationException extends  PrismaClientValidationError{
    public constructor(message:string) {
       super(message) 
    }
}