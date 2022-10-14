import { Request, Response } from "express"
import {
  controller,
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
} from "inversify-express-utils"
import {
  CreateCategoryDto,
  GetCategoryDto,
  UpdateCategoryDto,
} from "../../logic/dtos/category"
import { CategoryService } from "../../logic/services/category.service"
import { BaseHttpResponse } from "../lib/base-http-response"
import { CheckRoleMiddleware, DeserializeUserMiddleware, RequireUserMiddleware, ValidateRequestMiddleware } from "../middleware"

@controller(
  "/category",
  DeserializeUserMiddleware.run(),
  RequireUserMiddleware.run(),
  CheckRoleMiddleware.isAdmin
)
export class CategoryController {
  public constructor(private readonly _categoryService: CategoryService) {}

  @httpGet("/")
  public async findAll(req: Request, res: Response) {
    const categories = await this._categoryService.findAll()

    const response = BaseHttpResponse.success(categories)

    res.status(response.statusCode).json(response)
  }

  @httpPost("/", ValidateRequestMiddleware.with(CreateCategoryDto))
  public async create(req: Request, res: Response) {
    const category = await this._categoryService.create(req.body)

    const response = BaseHttpResponse.success(category)

    res.status(response.statusCode).json(response)
  }

  @httpPatch("/:id", ValidateRequestMiddleware.withParams(UpdateCategoryDto))
  public async update(req: Request, res: Response) {
    await this._categoryService.update(req.body)

    const response = BaseHttpResponse.success({}, 200)

    res.status(response.statusCode).json(response)
  }

  @httpDelete("/:id", ValidateRequestMiddleware.withParams(GetCategoryDto))
  public async delete(req: Request, res: Response) {
    await this._categoryService.delete(req.body)

    const response = BaseHttpResponse.success({}, 200)

    res.status(response.statusCode).json(response)
  }
}
