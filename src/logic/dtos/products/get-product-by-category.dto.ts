import { CouldNotFindException } from "../../exceptions"

export class GetProductByCategoryDto {
  public constructor(public category: string,public page:number=1) {}

  public static from(body: Partial<GetProductByCategoryDto>) {
    if (!body.category) {
      throw new CouldNotFindException("Missing category property")
    }

    return new GetProductByCategoryDto(body.category,body.page)
  }
}
