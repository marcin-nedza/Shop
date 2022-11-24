import { ValidationException } from "../../exceptions/validation-exception"

export class SignInUserDto {
  public constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
  public static from(body: Partial<SignInUserDto>) {
    if (!body.email) {
      throw new ValidationException("missing email property")
    }
    if (!body.password) {
      throw new ValidationException("missing password property")
    }
    return new SignInUserDto(body.email, body.password)
  }
}
