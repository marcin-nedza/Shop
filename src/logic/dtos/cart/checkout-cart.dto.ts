import { CouldNotFindException } from "../../exceptions"

export class CheckoutCartDto {
  public constructor(
    public readonly userId: string,
  ) {}

  public static from(body: Partial<CheckoutCartDto>) {
        console.log('WE ARE HERE');
        
    if (!body.userId) {
        console.log('WE ARE HERE2');
      throw new CouldNotFindException("Missing userId property")
    }
    return new CheckoutCartDto(body.userId)
  }
}
