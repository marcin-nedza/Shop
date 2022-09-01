export class CreateCartDto {
  public constructor(public readonly userId: string,public readonly summary:number=0) {}

  public static from(body:CreateCartDto){
    return new CreateCartDto(body.userId,body.summary);
  }
}
