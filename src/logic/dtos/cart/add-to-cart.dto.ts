import { CouldNotFindException } from "../../exceptions"

export class AddToCartDto {
  public constructor(
    public readonly userId: string,
    public readonly amount: number,
    public readonly productId: string,
    public readonly description?:string
  ) {}

  public static from(body: AddToCartDto) {
    if (!body.userId) {
      throw new CouldNotFindException("Missing userId property")
    }
    if (!body.amount) {
      throw new CouldNotFindException("Missing amount property")
    }
    if (!body.productId) {
      throw new CouldNotFindException("Missing productId property")
    }

    return new AddToCartDto(body.userId, body.amount, body.productId,body.description)
  }
}
