import { Cart, Product } from "@prisma/client"
import { injectable } from "inversify"
import stripe from "stripe"

const stripeApi = new stripe(process.env.STRIPE_PUBLIC_KEY as string, {
  apiVersion: "2022-11-15",
})
export type TCart = Cart & {
  singleOrders: [
    {
      id: string
      amount: number
      product: Product
      cartId: string
    }
  ]
}
@injectable()
export class StripeRepository {
  public async checkout(cart: TCart) {
    const session = await stripeApi.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cart.singleOrders.map((item) => {
        console.log("items", item.product.price)
        return {
          price_data: {
            currency: "USD",
            product_data: {
              name: item.product.name,
            },
            unit_amount: item.product.price * (item.amount / 10),
          },
          quantity: 1,
        }
      }),
      cancel_url: `${process.env.HOST_URL}/cancel` ?? "http://localhost:3000/reject",
      success_url: `${process.env.HOST_URL}/success` ?? "http://localhost:3000/success",
    })
    return session
  }
}
