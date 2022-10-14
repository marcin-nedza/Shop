import { CouldNotFindException } from "../../exceptions";

export class GetCategoryDto{
    public constructor(
        public readonly id:string
    ){}

    public static from(body:GetCategoryDto){
        if(!body.id){
            throw new CouldNotFindException("Missing id property")
        }
        return new GetCategoryDto(body.id)
    }
}