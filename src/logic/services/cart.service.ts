import { injectable } from "inversify"
import { CartRepository } from "../../data/repositories"
import { CartDto, CreateCartDto, GetCartDto, GetSingleOrderDto } from "../dtos/cart"
import { AddToCartDto } from "../dtos/cart"
import { CouldNotFindException } from "../exceptions"

@injectable()
export class CartService {
  public constructor(public _cartRepo: CartRepository) {}

  public async findById(getCartDto: GetCartDto) {
    const cart = await this._cartRepo.findById(getCartDto.userId)
    if (!cart) {
      throw new CouldNotFindException("Cart not found")
    }
    return CartDto.from(cart)
  }

  public async create(createCartDto: CreateCartDto) {
    const cart = await this._cartRepo.create(createCartDto)

    return CartDto.from(cart)
  }

  public async addToCart(addToCartDto: AddToCartDto) {
    const cart = await this._cartRepo.findById(addToCartDto.userId)
    if (!cart) {
      throw new CouldNotFindException("Cart not found")
    }

    const singleOrder = await this._cartRepo.createSingleOrder({
      cartId: cart.id,
      amount: addToCartDto.amount,
      productId: addToCartDto.productId,
      description: addToCartDto.description || null
    })

    const updatedCart = await this._cartRepo.connectSingleOrderToCart({
      cartId: cart.id,
      singleOrderId: singleOrder.id,
    })

    return CartDto.from(updatedCart)
  }

  public async removeSingleOrderFromCart(getSingleOrderDto: GetSingleOrderDto) {
    return this._cartRepo.removeSingleOrder(getSingleOrderDto.id)
  }
}
