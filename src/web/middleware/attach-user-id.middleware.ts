import { NextFunction, Request, Response } from "express"

export class AttachUserId{


    public static attach(req: Request, res: Response, next: NextFunction){
        const userId = res.locals.user.user.id
        if(userId){
            req.body={
                ...req.body,
            userId:userId
            }
            next()
        }
    }
}