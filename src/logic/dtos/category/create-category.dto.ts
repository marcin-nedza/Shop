import { GenericError } from "../../exceptions";

export class CreateCategoryDto{
    public constructor(
        public title:string,
    ){}

    public static from(body:CreateCategoryDto){
        if(!body.title){
            throw new GenericError('Category title is required');
        }
        return new CreateCategoryDto(body.title)    
    }
}