import { CouldNotFindException } from "../../../logic/exceptions";

export class GetByQueryDto{
    public constructor(public categoryId: string) {}

    public static from (body: Partial<GetByQueryDto>){
        if(!body.categoryId){
            // throw new CouldNotFindException('Missing categoryId property');
            body.categoryId=''
        }

        return new GetByQueryDto(body.categoryId)
    }
}