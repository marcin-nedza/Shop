import { Request, Response } from "express"
import {
    controller,
    httpDelete,
    httpGet,
    httpPatch,
    httpPost
} from "inversify-express-utils"
import {
    CreateProductDto,
    GetByQueryDto,
    GetProductByCategoryDto,
    GetProductByNameDto,
    GetProductDto,
    UpdateProductDto
} from "../../logic/dtos/products"
import { ProductService } from "../../logic/services"
import { BaseHttpResponse } from "../lib/base-http-response"
import {
    CheckRoleMiddleware,
    DeserializeUserMiddleware,
    RequireUserMiddleware,
    ValidateRequestMiddleware
} from "../middleware"

@controller("/product")
export class ProductController {
  public constructor(private readonly _productService: ProductService) {}

  @httpGet("/", ValidateRequestMiddleware.withParamsAndQuery(GetByQueryDto))
  public async index(req: Request, res: Response) {
    const products = await this._productService.all(req.body)

    const response = BaseHttpResponse.success(products)

    res.status(response.statusCode).json(response)
  }

  @httpGet("/:id", ValidateRequestMiddleware.withParams(GetProductDto))
  public async findOne(req: Request, res: Response) {
    const product = await this._productService.findById(req.body)

    const response = BaseHttpResponse.success(product)

    res.status(response.statusCode).json(response)
  }

  @httpGet(
    "/name/search/:page",
    ValidateRequestMiddleware.withParamsAndQuery(GetProductByNameDto)
  )
  public async findByName(req: Request, res: Response) {
    const products = await this._productService.findByName(req.body)

    const response = BaseHttpResponse.success(products)

    res.status(response.statusCode).json(response)
  }

  @httpGet(
    "/category/search/:page?",
    ValidateRequestMiddleware.withParamsAndQuery(GetProductByCategoryDto)
  )
  public async findByCategory(req: Request, res: Response) {
    const products = await this._productService.findByCategory(req.body)

    const response = BaseHttpResponse.success(products)

    res.status(response.statusCode).json(response)
  }

  @httpPost("/suggested", ValidateRequestMiddleware.with(GetProductByCategoryDto))
  public async findSuggested(req: Request, res: Response) {
    const products = await this._productService.findSuggested(req.body)

    const response = BaseHttpResponse.success(products)

    res.status(response.statusCode).json(response)
  }

  @httpPost(
    "/",
    DeserializeUserMiddleware.run(),
    RequireUserMiddleware.run(),
    CheckRoleMiddleware.isAdmin,
    ValidateRequestMiddleware.with(CreateProductDto)
  )
  public async create(req: Request, res: Response) {
    const product = await this._productService.create(req.body)

    const response = BaseHttpResponse.success(product)

    res.status(response.statusCode).json(response)
  }

  @httpPatch(
    "/:id",
    DeserializeUserMiddleware.run(),
    RequireUserMiddleware.run(),
    CheckRoleMiddleware.isAdmin,
    ValidateRequestMiddleware.withParams(UpdateProductDto)
  )
  public async update(req: Request, res: Response) {
    await this._productService.updateOne(req.body)

    const response = BaseHttpResponse.success({}, 200)

    res.status(response.statusCode).json(response)
  }

  @httpDelete(
    "/:id",
    DeserializeUserMiddleware.run(),
    RequireUserMiddleware.run(),
    CheckRoleMiddleware.isAdmin,
    ValidateRequestMiddleware.withParams(GetProductDto)
  )
  public async delete(req: Request, res: Response) {
    await this._productService.deleteOne(req.body)

    const response = BaseHttpResponse.success({}, 200)

    res.status(response.statusCode).json(response)
  }
}
