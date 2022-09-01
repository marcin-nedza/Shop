import { injectable } from "inversify"
import bcrypt from "bcryptjs"
import { CouldNotFindUserException, GenericError } from "../exceptions"
import { UserRepository } from "../../data/repositories"
import {
  CreateUserDto,
  GetOneUserDto,
  SignInUserDto,
  UpdateUserDto,
  UserDto,
} from "../dtos/users"
@injectable()
export class UserService {
  public constructor(private readonly _userRepo: UserRepository) {}

  public async all() {
    const users = await this._userRepo.all()

    //TODO: zmien users na UserDto i zobacz co sie zmienia
    return UserDto.fromMany(users)
  }

  public async findOne(getOneUserDto: GetOneUserDto) {
    const user = await this._userRepo.findOneById(getOneUserDto.id)
    if (!user) {
      throw new CouldNotFindUserException()
    }
    return UserDto.from(user)
  }

  public async hashPassword(password: string) {
    return await bcrypt.hash(password, bcrypt.genSaltSync(5))
  }

  public async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password)
    const createdUser = await this._userRepo.create({
      ...createUserDto,
      password: hashedPassword,
    })

    return UserDto.from(createdUser)
  }

  public async updateOne(updateUserDto: UpdateUserDto) {
    return this._userRepo.updateOne({
      id: updateUserDto.id,
      email: updateUserDto.email,
      username: updateUserDto.username,
      role: updateUserDto.role,
    })
  }

  public async deleteOne({ id }: GetOneUserDto) {
    await this._userRepo.deleteOne(id)
    return true
  }

  public async verifyPassword(payload: SignInUserDto) {
    const user = await this._userRepo.findByEmail(payload.email)
    if (!user) {
      throw new CouldNotFindUserException()
    }

    const isValid = await bcrypt.compare( payload.password,user.password)
    if (!isValid) {
      throw new GenericError("Invalid password")
    }
    return user
    
  }
}
