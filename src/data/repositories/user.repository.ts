import { injectable } from "inversify"
import { DBContext } from "../db.context"
import { User } from "@prisma/client"

@injectable()
export class UserRepository {
  public constructor(private readonly _dbContext: DBContext) {}

  public async all() {
    return this._dbContext.models.user.findMany()
  }

  public async findOneById(id: User["id"]) {
    return this._dbContext.models.user.findUnique({
      where: { id },
    })
  }

  public async findByEmail(email: string) {
    return this._dbContext.models.user.findUnique({
      where: { email },
    })
  }
  public async create(entity: Omit<User, "id">) {
    return this._dbContext.models.user.create({ data: entity })
  }

  public async updateOne(payload: Partial<User>) {
    const foundUser = await this._dbContext.models.user.findUnique({
      where: {
        id: payload.id,
      },
    })
    if (!foundUser) {
      throw new Error("No user found")
    }
    return this._dbContext.models.user.update({
      where: { id: payload.id },
      data: {
        username: payload.username,
        email: payload.email,
        role: payload.role,
      },
    })
  }

  public async deleteOne(id: User["id"]) {
    return this._dbContext.models.user.delete({
      where: { id },
    })
  }

  // public async verifyPassword(password:string)
}
