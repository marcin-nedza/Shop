export class UpdateUserDto {
  public constructor(
    public readonly id: string,
    public readonly email?: string,
    public readonly username?: string,
    public readonly role?: "BASIC" | "ADMIN"
  ) {}
  public static from(body:Partial<UpdateUserDto>){
    if(!body.id){
        throw new Error("Missing user id");
    }
    return new UpdateUserDto(body.id, body.email, body.username, body.role)
  }
}
