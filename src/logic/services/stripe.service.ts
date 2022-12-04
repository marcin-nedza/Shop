import { User } from "@prisma/client"
import { injectable } from "inversify"
import { TCart } from "src/data/repositories/stripe.repository"
import { CartRepository, StripeRepository } from "../../data/repositories"
import { CouldNotFindException } from "../exceptions"

@injectable()
export class StripeService {
    public constructor(private readonly cartRepository: CartRepository, private readonly stripeApi: StripeRepository) {

    }

    public async checkoutCart(id: User["id"]) {
        const cart = await this.cartRepository.findById(id)
        console.log(cart)
        return cart
    }

    public async stripeCreateSession(id:string) {
        const cart = await this.cartRepository.findById(id) as TCart
        if(!cart){
            throw new CouldNotFindException('Cart not found') 
        }
        return this.stripeApi.checkout(cart)
  }
}
