import { CouldNotFindException } from "../../../logic/exceptions";

export class GetProductDto{
    public constructor(
        public readonly id:string
    ){}

    public static from(body:Partial<GetProductDto>){
        if(!body.id){
            throw new CouldNotFindException('Missing id property');
        }
    
        return new GetProductDto(body.id);
    }
}