import { Request, Response } from "express"
import { controller, httpGet, httpPost } from "inversify-express-utils"
import { SignInUserDto } from "../../logic/dtos/users"
import { AuthenticationService } from "../../logic/services"
import { BaseHttpResponse } from "../lib/base-http-response"
import {
    DeserializeUserMiddleware,
    RequireUserMiddleware,
    ValidateRequestMiddleware
} from "../middleware"

@controller("/session")
export class AuthenticationController {
  public constructor(
    private readonly _authenticationService: AuthenticationService
  ) {}

  @httpGet("/", DeserializeUserMiddleware.run(), RequireUserMiddleware.run())
  public async index(req: Request, res: Response) {
    res.status(200)
  }

  @httpPost("/", ValidateRequestMiddleware.with(SignInUserDto))
  public async create(req: Request, res: Response) {
    const {accessToken,user_id,role,username} = await this._authenticationService.signIn(req.body)
    
    const response = BaseHttpResponse.success(accessToken)
    
    res.status(response.statusCode).cookie("Bearer ", accessToken, {
      maxAge:Number(process.env.MAX_AGE),
      httpOnly: true,
      sameSite:'none',
      secure:true
    }).json({
      ttl:new Date(Date.now() + Number(process.env.MAX_AGE)),
      id:user_id,
      role,
      username
            })
  }
  
  @httpPost('/logout')
  public async logout(req: Request, res: Response){
    const response = BaseHttpResponse.success({})

    res.status(response.statusCode).cookie("Bearer ",'none',{
      expires:new Date(Date.now() + 10),
      httpOnly:true
    })
  }
}
