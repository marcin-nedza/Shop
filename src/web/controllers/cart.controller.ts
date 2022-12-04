import { Request, Response } from "express"
import {
    controller,
    httpDelete,
    httpGet,
    httpPost
} from "inversify-express-utils"
import {
    AddToCartDto,
    CheckoutCartDto,
    CreateCartDto,
    GetCartDto,
    RemoveSingleOrderDto
} from "../../logic/dtos/cart"
import { CartService, StripeService } from "../../logic/services"
import { BaseHttpResponse } from "../lib/base-http-response"
import {
    AttachUserId,
    DeserializeUserMiddleware,
    RequireUserMiddleware,
    ValidateRequestMiddleware
} from "../middleware"



@controller(
  "/cart",
  DeserializeUserMiddleware.run(),
  RequireUserMiddleware.run()
)
export class CartController {
  public constructor(private readonly _cartService: CartService,private readonly _stripeService: StripeService) {}

  @httpGet("/", AttachUserId.attach, ValidateRequestMiddleware.with(GetCartDto))
  public async findById(req: Request, res: Response) {
    const cart = await this._cartService.findById(req.body)
            
    const response = BaseHttpResponse.success(cart)

    res.status(response.statusCode).json(response)
  }

  @httpPost(
    "/",
    AttachUserId.attach,
    ValidateRequestMiddleware.with(CreateCartDto)
  )
  public async create(req: Request, res: Response) {
    const cart = await this._cartService.create(req.body)

    const response = BaseHttpResponse.success(cart)

    res.status(response.statusCode).json(response)
  }

  @httpPost(
    "/add/:productId",
    AttachUserId.attach,
    ValidateRequestMiddleware.withParams(AddToCartDto)
  )
  public async addToCart(req: Request, res: Response) {
    const cart = await this._cartService.addToCart(req.body)

    const response = BaseHttpResponse.success(cart)

    res.status(response.statusCode).json(response)
  }

 @httpPost('/checkout',
    AttachUserId.attach,
    ValidateRequestMiddleware.with(CheckoutCartDto))
    public async checkout(req: Request, res: Response){
        const session = await this._stripeService.stripeCreateSession(req.body.userId)

        const response = BaseHttpResponse.success(session)

        res.status(response.statusCode).json(response)
    }

  @httpDelete(
    "/removeOne/:id/:singleOrderId",
    AttachUserId.attach,
    ValidateRequestMiddleware.withParams(RemoveSingleOrderDto)
  )
  public async removeSingleOrder(req: Request, res: Response) {
    await this._cartService.removeSingleOrderFromCart(req.body)

    const response = BaseHttpResponse.success({})

    res.status(response.statusCode).json(response)
  }

  @httpDelete('/all',AttachUserId.attach,ValidateRequestMiddleware.with(GetCartDto))
  public async removeAllOrders(req: Request, res: Response) {
    await this._cartService.removeAllOrders(req.body)

    const response = BaseHttpResponse.success({})

    res.status(response.statusCode).json(response)
    }
}
