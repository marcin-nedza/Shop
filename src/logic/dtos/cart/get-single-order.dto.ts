import { CouldNotFindException } from "../../exceptions";

export class GetSingleOrderDto{
    public constructor(public readonly id:string){}

    public static from(body:GetSingleOrderDto){
        if(!body.id){
            throw new CouldNotFindException("Missing id property")
        }
    
        return new GetSingleOrderDto(body.id)
    }
}