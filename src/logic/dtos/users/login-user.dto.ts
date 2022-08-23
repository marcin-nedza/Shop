import { ValidationException } from "../../exceptions/validation-exception";

export class LoginUserDto {
  public constructor(
    public readonly email: string,
    public readonly password: string
  ) {}
  public static from(body:Partial<LoginUserDto>){
    if(!body.email){
        throw new ValidationException('missing email property')
    }
    if(!body.password){
        throw new ValidationException('missing password property')
        }
    return new LoginUserDto(body.email, body.password)
  }
}
