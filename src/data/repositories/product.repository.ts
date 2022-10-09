import { injectable } from "inversify"
import { DBContext } from "../db.context"
import { Product } from "@prisma/client"
import { CouldNotFindException } from "../../logic/exceptions"
import { Cloudinary } from "../../web/lib/cloudinary"
@injectable()
export class ProductRepository {
  public constructor(private readonly _dbContext: DBContext) {}

  public async all() {
    return this._dbContext.models.product.findMany()
  }

  public async create(entity: Omit<Product, "id">) {
    return this._dbContext.models.product.create({ data: entity })
  }

  public async findById(id: Product["id"]) {
    return this._dbContext.models.product.findUnique({ where: { id } })
  }

  public async findByPlu(plu: Product["plu"]) {
    return this._dbContext.models.product.findUnique({ where: { plu } })
  }

  public async findByName(searchName: Product["name"]) {
    return this._dbContext.models.product.findMany({
      where: {
        name: {
          contains: searchName,
          mode: "insensitive",
        },
      },
    })
  }

  //simple pagination with fixed number of results
  public async findByCategory(payload: {
    category: Product["category"]
    page: number
  }) {
    return this._dbContext.models.product.findMany({
      where: {
        category: payload.category,
      },
      take: 2,
      skip: (payload.page - 1) * 2,
      orderBy: { plu: "asc" },
    })
  }

  public async updateOne(payload: Partial<Product>) {
    const foundProduct = await this._dbContext.models.product.findUnique({
      where: { id: payload.id },
    })
    if (!foundProduct) {
      throw new CouldNotFindException("Product not found")
    }
    return this._dbContext.models.product.update({
      where: { id: payload.id },
      data: {
        ...payload,
      },
    })
  }



  public async deleteOne(id: Product["id"]) {
    const foundProduct = await this._dbContext.models.product.findUnique({
      where: { id: id },
    })
    if (!foundProduct) {
      throw new CouldNotFindException("Product not found")
    }
    return this._dbContext.models.product.delete({ where: { id: id } })
  }
}
