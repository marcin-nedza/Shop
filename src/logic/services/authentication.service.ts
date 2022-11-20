import { injectable } from "inversify"
import { SignInUserDto } from "../dtos/users"
import { JwtUtils } from "../utils/jwt-utils"
import { UserService } from "./users.service"

@injectable()
export class AuthenticationService {
  public constructor(
    private readonly _userService: UserService,
    private readonly _jwtUtils: JwtUtils
  ) {}

  public async signIn(signInUserDto: SignInUserDto) {
    const user = await this._userService.verifyPassword(signInUserDto)
    
    const accessToken = this._jwtUtils.signJwt(
      { user },
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION }
    )

    return {accessToken,user_id: user.id,role:user.role,username:user.username}
  }
}
