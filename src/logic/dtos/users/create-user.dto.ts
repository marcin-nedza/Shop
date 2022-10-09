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
      throw new GenericError("Name is required")
    }
    if (!body.email) {
      throw new GenericError("Email is required")
    }
    if(!body.email.includes('@')){
      throw new GenericError("Email is invalid")
    }
    if (!body.password) {
      throw new GenericError('Password is required')
    }
  
    return new CreateUserDto(body.username, body.email ,body.password,body.role)
  }
}
