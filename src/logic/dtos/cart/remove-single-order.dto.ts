import { CouldNotFindException } from "../../exceptions"

export class RemoveSingleOrderDto {
  public constructor(
    public readonly id: string,
    public readonly singleOrderId: string,
    public readonly userId:string
  ) {}

  public static from(body: RemoveSingleOrderDto) {
    if (!body.id) {
      throw new CouldNotFindException("Missing cart id property")
    }
    if (!body.singleOrderId) {
      throw new CouldNotFindException("Missing singleOrderId property")
    }
    if(!body.userId) {
      throw new CouldNotFindException("Missing userId property")
      }

    return new RemoveSingleOrderDto(body.id, body.singleOrderId,body.userId)
  }
}
