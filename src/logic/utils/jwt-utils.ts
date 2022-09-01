/* eslint-disable @typescript-eslint/ban-ts-comment */
import { injectable } from "inversify"
import jwt from "jsonwebtoken"
import { User } from "@prisma/client"

export interface IToken {
  expired: boolean
  decoded?: User | null
  error?: string
}

const jwt_secret = process.env.JWT_SECRET 
@injectable()
export class JwtUtils {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public constructor() {}

  public  signJwt(object: object, options?: jwt.SignOptions | undefined) {
    return jwt.sign(object, jwt_secret as string, { ...(options && options) })
  }

  public static async verifyJwt(token: string): Promise<IToken> {
    //@ts-ignore
    try {
    const decoded: any = jwt.verify(token, jwt_secret as string)
      
    return {
      expired: false,
      decoded,
    }
    } catch (error) {
      return {
        expired: true,
        error: "token expired",
        decoded: null,
      }
    }
  }
}
