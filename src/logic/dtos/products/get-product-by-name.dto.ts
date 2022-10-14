import { CouldNotFindException } from "../../exceptions"

export class GetProductByNameDto {
  public constructor(public name: string, public page: number = 1) {}

  public static from(body: Partial<GetProductByNameDto>) {
    if (!body.name) {
      throw new CouldNotFindException("Name cannot be empty")
    }

    return new GetProductByNameDto(body.name, body.page)
  }
}
