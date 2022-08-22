
export class GetOneUserDto{
    public constructor(public readonly id:string){}

    public static from(body:Partial<GetOneUserDto>){
        if(!body.id){
            throw new Error('Missing id property')
        }
        return new GetOneUserDto(body.id);
    }
}