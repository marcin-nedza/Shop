import {Cart, SingleOrder} from "@prisma/client"
export class CartDto {
    public constructor(
        public readonly id: string,
        public readonly userId:string,
        public readonly singleOrders:Array<SingleOrder>,
        public readonly summary?:number,

    ){}

    public static from(entity:Cart){
        //@ts-ignore
        return new CartDto(entity.id, entity.userId, entity.singleOrders,entity.summary)
    }
}