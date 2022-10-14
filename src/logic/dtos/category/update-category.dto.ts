import { CouldNotFindException, GenericError } from "../../exceptions";


export class UpdateCategoryDto{
    public constructor(
        public id:string,
        public readonly newTitle:string
    ){}

    public static from(body:Partial<UpdateCategoryDto>){
        if(!body.id){
            throw new CouldNotFindException("Missing id property")
        }
        if(!body.newTitle){
            throw new GenericError('Missing newTitle property')
        }
        return new UpdateCategoryDto(body.id, body.newTitle)
    }
}