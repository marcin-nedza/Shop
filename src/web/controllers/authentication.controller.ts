import { Request, Response } from "express"
import { controller, httpGet, httpPost } from "inversify-express-utils"
import { SignInUserDto } from "../../logic/dtos/users"
import { AuthenticationService } from "../../logic/services/authentication.service"
import { BaseHttpResponse } from "../lib/base-http-response"
import {
    CheckRoleMiddleware,
  DeserializeUserMiddleware,
  RequireUserMiddleware,
  ValidateRequestMiddleware,
} from "../middleware"

@controller("/session")
export class AuthenticationController {
  public constructor(
    private readonly _authenticationService: AuthenticationService
  ) {}

  @httpGet("/", DeserializeUserMiddleware.run(), RequireUserMiddleware.run(),CheckRoleMiddleware.isAdmin)
  public async index(req: Request, res: Response) {
    res.status(200).json("success")
  }
  @httpPost("/", ValidateRequestMiddleware.with(SignInUserDto))
  public async create(req: Request, res: Response) {
    const token = await this._authenticationService.signIn(req.body)

    const response = BaseHttpResponse.success(token)

    res.status(response.statusCode).cookie("accessToken", token, {
      maxAge: 3.154e10,
      httpOnly: true,
    })
  }
}
