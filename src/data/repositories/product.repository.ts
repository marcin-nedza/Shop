import { injectable } from "inversify"
import { DBContext } from "../db.context"
import { Product } from "@prisma/client"
import { CouldNotFindException } from "../../logic/exceptions"
import { Cloudinary } from "../../web/lib/cloudinary"
@injectable()
export class ProductRepository {
  public constructor(private readonly _dbContext: DBContext) {}

  //DEV ONLY
  public async bulkCreate() {
    return this._dbContext.models.product.createMany({
      data: [
        {
          name: "prod1",
          plu: 1,
          price: 2.33,
          unit: "gram",
          categoryId: "7109c724-26bc-417d-b7eb-3588ee5750fe",
        },
        {
          name: "prod2",
          plu: 2,
          price: 3.33,
          unit: "gram",
          categoryId: "7109c724-26bc-417d-b7eb-3588ee5750fe",
        },
        {
          name: "prod3",
          plu: 3,
          price: 4.33,
          unit: "pcs",
          categoryId: "78b0b5c9-dd73-4cf1-add7-27ffb103cf12",
        },
        {
          name: "prod4",
          plu: 4,
          price: 5.33,
          unit: "pcs",
          categoryId: "78b0b5c9-dd73-4cf1-add7-27ffb103cf12",
        },
        {
          name: "prod5",
          plu: 5,
          price: 6.33,
          unit: "gram",
          categoryId: "78b0b5c9-dd73-4cf1-add7-27ffb103cf12",
        },
      ],
    })
  }
  public async all() {
    return this._dbContext.models.product.findMany({
      include: {
        category: {
          select: {
            title: true,
          },
        },
      },
    })
  }

  public async create(entity: Omit<Product, "id">) {
    return this._dbContext.models.product.create({
      data: entity,
      include: { category: true },
    })
  }

  public async findById(id: Product["id"]) {
    return this._dbContext.models.product.findUnique({
      where: { id },
      include: { category: true },
    })
  }

  public async findByPlu(plu: Product["plu"]) {
    return this._dbContext.models.product.findUnique({ where: { plu } })
  }

  public async findByName(payload: { name: string; page: number }) {

    const count = await this._dbContext.models.product.count({
      where: {
        name: {
          contains: payload.name,
          mode: "insensitive",
        },
      },
    })
    
    const products=await this._dbContext.models.product.findMany({
      where: {
        name: {
          contains: payload.name.trim(),
          mode: "insensitive",
        },
      },
      include: { category: { select: { title: true } } },
      take: 5,
      // skip: (payload.page - 1) * 2,
      skip:(5 * payload.page) - 5,
      orderBy: { plu: "asc" },
    })

    return {products,count}
  }

  //simple pagination with fixed number of results
  public async findByCategory(payload: {
    category: Product["categoryId"]
    page: number
  }) {
    const count = await this._dbContext.models.product.count({
      where: {
        categoryId:payload.category
      },
    })
    const products = await this._dbContext.models.product.findMany({
      where: {
        categoryId: payload.category,
      },
      take: 2,
      // skip: (payload.page - 1) * 2,
      skip:(2 * payload.page) - 2,
      orderBy: { plu: "asc" },
    })
    return {products,count}
  }


  public async updateOne(payload: Partial<Product>) {
    const foundProduct = await this._dbContext.models.product.findUnique({
      where: { id: payload.id },
    })
    if (!foundProduct) {
      throw new CouldNotFindException("Product not found")
    }
    console.log("@@",payload)
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
