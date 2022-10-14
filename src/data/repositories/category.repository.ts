import { injectable } from "inversify"
import { Category } from "@prisma/client"
import { DBContext } from "../db.context"
import { CategoryDto } from "src/logic/dtos/category/category.dto"

@injectable()
export class CategoryRepository {
  public constructor(private readonly _dbContext: DBContext) {}

  public async create(entity: Omit<Category, "id">) {
    return this._dbContext.models.category.create({
      data: entity,
    })
  }

  public async findAll() {
    return this._dbContext.models.category.findMany()
  }

  public async findOne(title: CategoryDto["title"]) {
    return this._dbContext.models.category.findUnique({
      where: { title},
    })
  }

  public async findById(id: Category["id"]) {
    return this._dbContext.models.category.findUnique({ where: { id}})
  }
  
  public async updateOne(payload: {
    id: CategoryDto["id"]
    newTitle: string
  }) {
    return this._dbContext.models.category.update({
      where: { id: payload.id },
      data: {title:payload.newTitle},
    })
  }

  public async delete(id: CategoryDto["id"]) {
    return this._dbContext.models.category.delete({ where: { id } })
  }
}
