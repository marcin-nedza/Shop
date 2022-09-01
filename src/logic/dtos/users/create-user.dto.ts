import { GenericError } from "../../exceptions"

export class CreateUserDto {
  public constructor(
    public readonly username: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: 'USER' | 'ADMIN'='USER'
  ) {}

  public static from(body: Partial<CreateUserDto>) {
    if (!body.username) {
      throw new GenericError("name is required")
    }
    if (!body.email) {
      throw new GenericError("email is required")
    }
    if (!body.password) {
      throw new GenericError('password is required')
    }
  
    return new CreateUserDto(body.username, body.email ,body.password,body.role)
  }
}
