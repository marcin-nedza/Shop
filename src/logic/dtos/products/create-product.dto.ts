import { Unit } from "@prisma/client";
import { GenericError } from "../../exceptions";

export class CreateProductDto{
    public constructor(
        public readonly name: string,
        public readonly price:number,
        public readonly plu:number,
        public readonly unit:Unit,
        public readonly category:string,
        public readonly photo:Buffer =Buffer.alloc(1)
    ){}

    public static from(body:Partial<CreateProductDto>){
        if(!body.name){
            throw new GenericError('Name is required')
        }
        if(!body.price){
            throw new GenericError('Price is required')
        }
        if(!body.plu){
            throw new GenericError('Plu is required')
        }
        if(!body.unit){
            throw new GenericError('Unit is required')
        }
        if(body.unit !=='gram' && body.unit !=='pcs'){
            throw new GenericError('Unit can be gram or pcs')
        }
        if(!body.category){
            throw new GenericError('Category is required')
        }

        return new CreateProductDto(
            body.name,
            body.price,
            body.plu,
            body.unit,
            body.category,
            body.photo
        )
    }
}