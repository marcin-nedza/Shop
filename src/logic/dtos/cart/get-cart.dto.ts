import { CouldNotFindException } from "../../exceptions";

export class GetCartDto {
    public constructor(public readonly userId:string,public readonly summary?:number){}

    public static from(body:Partial<GetCartDto>){
        console.log(body)
        if(!body.userId){
            throw new CouldNotFindException('Missing userId property')
        }
        return new GetCartDto(body.userId, body.summary)
    }
}