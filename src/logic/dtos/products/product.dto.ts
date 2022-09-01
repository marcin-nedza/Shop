import { Product } from "@prisma/client"

export class ProductDto {
  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly plu: number,
    public readonly unit: "gram" | "pcs",
    public readonly category: string,
    public readonly photo: Buffer|null = Buffer.alloc(1),
  ) {}

  public static from(entity: Product) {
    return new ProductDto(
      entity.id,
      entity.name,
      entity.price,
      entity.plu,
      entity.unit,
      entity.category,
      entity.photo,
    )
  }

  public static fromMany(entity: Product[]) {
    return entity.map(product =>ProductDto.from(product));
  }
}
