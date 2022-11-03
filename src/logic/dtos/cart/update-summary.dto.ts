import { Unit } from "@prisma/client"
import { CouldNotFindException } from "../../exceptions"

export class UpdateSummaryDto {
  public constructor(
    public readonly id: string,
    public readonly price: number,
    public readonly amount: number,
    public readonly summary:number,
    public readonly unit:Unit
  ) {}

  public static from(body: UpdateSummaryDto) {
    if (!body.id) {
      throw new CouldNotFindException("Missing id property")
    }
    if (!body.price) {
      throw new CouldNotFindException("Missing price property")
    }
    if (!body.amount) {
      throw new CouldNotFindException("Missing amount property")
    }
    if(!body.summary) {
      throw new CouldNotFindException("Missing summary property")
      }
    if(!body.unit ){
      throw new CouldNotFindException("Missing unit property")
    }
    return new UpdateSummaryDto(body.id, body.price, body.amount,body.summary,body.unit)
  }
}
