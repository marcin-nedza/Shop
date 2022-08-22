
export class CreateUserDto {
  public constructor(
    public readonly username: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: 'BASIC' | 'ADMIN'='BASIC'
  ) {}

  public static from(body: Partial<CreateUserDto>) {
    if (!body.username) {
      throw new Error("name is required")
    }
    if (!body.email) {
      throw new Error("email is required")
    }
    if (!body.password) {
      throw new Error('password is required')
    }
  
    return new CreateUserDto(body.username, body.email ,body.password,body.role)
  }
}
