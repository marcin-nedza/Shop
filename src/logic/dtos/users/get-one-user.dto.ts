import { GenericError } from "../../exceptions";

export class GetOneUserDto{
    public constructor(public readonly id:string){}

    public static from(body:Partial<GetOneUserDto>){
        if(!body.id){
            throw new GenericError('Missing id property')
        }
        return new GetOneUserDto(body.id);
    }
}