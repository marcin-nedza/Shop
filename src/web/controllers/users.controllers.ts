import { Request, Response } from "express"
import {
  controller,
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
} from "inversify-express-utils"
import { CreateUserDto } from "../../logic/dtos/users/create-user.dto"
import { GetOneUserDto } from "../../logic/dtos/users/get-one-user.dto"
import { UpdateUserDto } from "../../logic/dtos/users/update-user.dto"
import { UserService } from "../../logic/services/users.service"
import { BaseHttpResponse } from "../lib/base-http-response"
import { ValidateRequestMiddleware } from "../middleware/validate-request.middleware"

@controller("/users")
export class UsersController {
  public constructor(private readonly _service: UserService) {}

  @httpGet("/")
  public async index(req: Request, res: Response) {
    const users = await this._service.all()

    const response = BaseHttpResponse.success(users)

    res.status(response.statusCode).json(response)
  }

  @httpGet("/:id", ValidateRequestMiddleware.withParams(GetOneUserDto))
  public async findOne(req: Request, res: Response) {
    const user = await this._service.findOne(req.body)

    const response = BaseHttpResponse.success(user, 200)

    res.status(response.statusCode).json(response)
  }

  @httpPost("/", ValidateRequestMiddleware.with(CreateUserDto))
  public async store(req: Request, res: Response) {
    const user = await this._service.create(req.body)

    const response = BaseHttpResponse.success(user, 201)

    res.status(response.statusCode).json(response)
  }

  @httpPatch("/:id", ValidateRequestMiddleware.withParams(UpdateUserDto))
  public async update(req: Request, res: Response) {
    await this._service.updateOne(req.body)

    const response = BaseHttpResponse.success({}, 200)

    res.status(response.statusCode).json(response)
  }

  @httpDelete("/:id", ValidateRequestMiddleware.withParams(GetOneUserDto))
  public async delete(req: Request, res: Response) {
    await this._service.deleteOne(req.body)

    const response = BaseHttpResponse.success({}, 200)

    res.status(response.statusCode).json(response)
  }
}
