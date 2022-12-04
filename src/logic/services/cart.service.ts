import { Unit } from "@prisma/client"
import { injectable } from "inversify"
import { CartRepository, ProductRepository } from "../../data/repositories"
import {
    AddToCartDto, CartDto,
    CreateCartDto,
    GetCartDto,
    RemoveSingleOrderDto,
    UpdateSummaryDto
} from "../dtos/cart"
import { CouldNotFindException } from "../exceptions"

@injectable()
export class CartService {
  public constructor(
    public _cartRepo: CartRepository,
    public _productRepo: ProductRepository
  ) {}

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

    //Adding multiple products to cart
    if (addToCartDto.multiplier) {
       await this._cartRepo.createMultipleOrder({
        multiplier: addToCartDto.multiplier,
        singleOrder: {
          cartId: cart.id,
          amount: addToCartDto.amount,
          productId: addToCartDto.productId,
          description: addToCartDto.description || null,
        },
      })
      const product = await this._productRepo.findById(addToCartDto.productId)
      if (!product) {
        throw new CouldNotFindException("Product not found")
      }
      await this.addToSummary({
        id: cart.id,
        summary: cart.summary,
        amount: addToCartDto.amount * addToCartDto.multiplier,
        price: product.price,
        unit: product.unit,
      })
    }
    //Adding one product to cart
    if (!addToCartDto.multiplier) {
      const singleOrder = await this._cartRepo.createSingleOrder({
        cartId: cart.id,
        amount: addToCartDto.amount,
        productId: addToCartDto.productId,
        description: addToCartDto.description || null,
      })
      const product = await this._productRepo.findById(addToCartDto.productId)
      if (!product) {
        throw new CouldNotFindException("Product not found")
      }
      await this.addToSummary({
        id: cart.id,
        summary: cart.summary,
        amount: singleOrder.amount,
        price: product.price,
        unit: product.unit,
      })
    }

    const updatedCart = await this._cartRepo.findById(addToCartDto.userId)
    if (!updatedCart) {
      throw new CouldNotFindException("Updated Cart not found")
    }
    return CartDto.from(updatedCart)
  }

  public async addToSummary(updateSummaryDto: UpdateSummaryDto) {
    const valueToAdd =
      updateSummaryDto.summary +
      (updateSummaryDto.amount * updateSummaryDto.price) /
        (updateSummaryDto.unit === Unit.gram ? 1000 : 1)
    return this._cartRepo.updateSummary({
      id: updateSummaryDto.id,
      summary: Math.round((valueToAdd + Number.EPSILON) * 100) / 100,
    })
  }

  public async substractFromSummary(updateSummaryDto: UpdateSummaryDto) {
    const valueToRemove =
      updateSummaryDto.summary -
      (updateSummaryDto.amount * updateSummaryDto.price) /
        (updateSummaryDto.unit === Unit.gram ? 1000 : 1)
        console.log(Math.round((valueToRemove + Number.EPSILON) * 100) / 100
)
     if(valueToRemove<0){
      return this._cartRepo.updateSummary({
      id: updateSummaryDto.id,
      summary:0 
      })
     }
    return this._cartRepo.updateSummary({
      id: updateSummaryDto.id,
      summary: Math.round((valueToRemove + Number.EPSILON) * 100) / 100,
    })
  }

  public async removeSingleOrderFromCart(
    removeSingleOrderDto: RemoveSingleOrderDto
  ) {
    const cart = await this._cartRepo.findById(removeSingleOrderDto.userId)
    if (!cart) {
      throw new CouldNotFindException("Cart not found")
    }

    const singleOrder = await this._cartRepo.findSingleOrder(
      removeSingleOrderDto.singleOrderId
    )
    if (!singleOrder) {
      throw new CouldNotFindException("Single order not found")
    }

    const product = await this._productRepo.findById(singleOrder.productId)
    if (!product) {
      throw new CouldNotFindException("Product not found")
    }

    await this.substractFromSummary({
      id: removeSingleOrderDto.id,
      amount: singleOrder.amount,
      price: product.price,
      summary: cart.summary,
      unit: product.unit,
    })
    return this._cartRepo.removeSingleOrder(removeSingleOrderDto.singleOrderId)
  }

  public async removeAllOrders(getCartDto: GetCartDto) {
    const cart = await this._cartRepo.findById(getCartDto.userId)
    if (!cart) {
      throw new CouldNotFindException("Cart not found")
    }
    await this._cartRepo.updateSummary({ id: cart.id, summary: 0 })
    return this._cartRepo.removeAllOrders(cart.id)
  }
}
