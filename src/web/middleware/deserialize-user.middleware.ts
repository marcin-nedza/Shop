import { Request, Response, NextFunction } from "express"
import { CouldNotFindException } from "../../logic/exceptions"
import { JwtUtils } from "../../logic/utils/jwt-utils"
import { BaseMiddleware } from "../lib/base-middleware"

export class DeserializeUserMiddleware extends BaseMiddleware {
  public constructor() {
    super()
  }

  public async execute(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.cookie?.replace(/^Bearer\s?=/, "")
      if (!accessToken) {
        return res
          .status(401)
          .json({ data: {}, error: "Access token is required", statusCode: 401 })
      }

      const { decoded, expired } = await JwtUtils.verifyJwt(accessToken)
      if (decoded) {
        res.locals.user = decoded
        return next()
      }
      if (expired) {
        return next()
      }
      
      return next()
    } catch (error) {
      throw new CouldNotFindException("aaaaa")
    }
  }
  public static run() {
    return new DeserializeUserMiddleware().execute
  }
}
