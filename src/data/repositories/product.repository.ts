import { injectable } from "inversify"
import { DBContext } from "../db.context"
import { Product } from "@prisma/client"
import { CouldNotFindException } from "../../logic/exceptions"

@injectable()
export class ProductRepository {
    public constructor(private readonly _dbContext: DBContext) { }

    public async all({ categoryId }: { categoryId: string }) {
        //Count get sum of all products

        let products, count
        //If we provide categoryId->query by it
        //If not then get all products

        categoryId.length > 0
            ? count = await this._dbContext.models.product.count({
                where: { categoryId },
            })
            : count = await this._dbContext.models.product.count()
        categoryId.length > 0
            ? products = await this._dbContext.models.product.findMany({
                where: { categoryId },
                include: {
                    category: {
                        select: {
                            title: true,
                        },
                    },
                },
                // orderBy:{name:"desc"}
            })
                : products = await this._dbContext.models.product.findMany({
                    include: {
                        category: {
                            select: {
                                title: true,
                            },
                        },
                    },
                    // orderBy:{name:"desc"}
                })

    return { products, count }
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

        const products = await this._dbContext.models.product.findMany({
            where: {
                name: {
                    contains: payload.name.trim(),
                    mode: "insensitive",
                },
            },
            include: { category: { select: { title: true } } },
            take: 5,
            // skip: (payload.page - 1) * 2,
            skip: 5 * payload.page - 5,
            orderBy: { plu: "asc" },
        })

        return { products, count }
    }

    //simple pagination with fixed number of results
    public async findByCategory(payload: {
        category: Product["categoryId"]
        page: number
    }) {
        const count = await this._dbContext.models.product.count({
            where: {
                categoryId: payload.category,
            },
        })
        const products = await this._dbContext.models.product.findMany({
            where: {
                categoryId: payload.category,
            },
            take: 5,
            // skip: (payload.page - 1) * 2,
            skip: 5 * payload.page - 5,
            orderBy: { plu: "asc" },
        })
        return { products, count }
    }

    public async findSuggested({ category }: {category:string}) {
        const random=Math.round((Math.random()))
      return this._dbContext.models.product.findMany({
            where:{
                categoryId:category
            },
            orderBy:{price:random>0?'asc':'desc'}
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
