import { Category, Product } from "@prisma/client"

export class ProductDto {
  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly plu: number,
    public readonly unit: "gram" | "pcs",
    public readonly categoryId: string,
    public readonly category?:Category,
    public readonly photo: string|null ='' 
  ) {}

  public static from(entity: ProductDto) {
    return new ProductDto(
      entity.id,
      entity.name,
      entity.price,
      entity.plu,
      entity.unit,
      entity.categoryId,
      entity.category,
      entity.photo,
      )
  }

  public static fromMany(entity: Product[]) {
    return entity.map(product =>ProductDto.from(product));
  }
}
