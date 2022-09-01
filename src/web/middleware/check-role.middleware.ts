import { NextFunction, Request, Response } from "express"
import { GenericError } from "../../logic/exceptions"

export class CheckRoleMiddleware {

    public static isAdmin(req: Request, res: Response, next: NextFunction){
        if(res.locals.user.user.role!=='ADMIN'){
            throw new GenericError('Need admin role')
        }
        next()
    }

    

}