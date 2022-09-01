import { Cart, SingleOrder, User } from "@prisma/client"
import { injectable } from "inversify"
import { CouldNotFindException } from "../../logic/exceptions"
import { DBContext } from "../db.context"

@injectable()
export class CartRepository {
  public constructor(private readonly _dbContext: DBContext) {}

  public async findById(id: User["id"]) {
    return this._dbContext.models.cart.findUnique({
      where: {
        userId: id,
      },
      include:{
        singleOrders: {
          include:{product:true}
        },
      }
    })
  }

  public async create(entity: Omit<Cart, "id">) {
    return this._dbContext.models.cart.create({
      data: entity,
    })
  }

  public async createSingleOrder(entity: Omit<SingleOrder, "id">) {
    return this._dbContext.models.singleOrder.create({
      data: entity,
    })
  }

  public async connectSingleOrderToCart(payload: {
    cartId: Cart["id"]
    singleOrderId: SingleOrder["id"]
  }) {
    return this._dbContext.models.cart.update({
      where: {
        id: payload.cartId,
      },
      data: {
        singleOrders: {
          connect: {
            id: payload.singleOrderId,
          },
        },
      },
    })
  }

  public async removeSingleOrder(id:SingleOrder["id"]) {
    const singleOrder=await this._dbContext.models.singleOrder.findUnique({where:{id}})
    if(!singleOrder){
      throw new CouldNotFindException('No single order found')
    }
    return this._dbContext.models.singleOrder.delete({where:{id:id}})
  }

}
