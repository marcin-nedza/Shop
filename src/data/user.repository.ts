import { injectable } from "inversify"
import { DBContext } from "./db.context"
import { IUserModel } from "./user.model"

@injectable()
export class UserRepository {
  public constructor(private readonly _dbContext: DBContext) {}

  public async all() {
    return this._dbContext.models.user.findMany()
  }

  public async findOneById(id: IUserModel["id"]) {
    return this._dbContext.models.user.findUnique({
      where: { id },
    })
  }

  public async findByEmail(email: string) {
    return this._dbContext.models.user.findUnique({
      where: { email },
    })
  }
  public async create(entity: Omit<IUserModel, "id">) {
    return this._dbContext.models.user.create({ data: entity })
  }

  public async updateOne(payload: Partial<IUserModel>) {
    const foundUser = await this._dbContext.models.user.findUnique({
      where: {
        id: payload.id,
      },
    })
    if (!foundUser) {
      throw new Error("User does not exist")
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

  public async deleteOne(id: IUserModel["id"]) {
    return this._dbContext.models.user.delete({
      where: { id },
    })
  }

  // public async verifyPassword(password:string)
}
