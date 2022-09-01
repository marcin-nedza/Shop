import { NextFunction, Request, Response } from "express"
import { GenericError } from "../../logic/exceptions"
import { BaseMiddleware } from "../lib/base-middleware"

export class RequireUserMiddleware extends BaseMiddleware {
  public constructor() {
    super()
  }

  public  execute(req: Request, res: Response, next: NextFunction) {
    const user = res.locals.user

    if (!user) {
      throw new GenericError("Unauthorized")
    }
    next()
  }
  public static run() {
    return new RequireUserMiddleware().execute
  }
}
