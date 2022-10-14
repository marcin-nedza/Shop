
export class CategoryDto{
    public constructor(
        public readonly id:string,
        public readonly title:string, 
    ){}
    
    public static from(entity:CategoryDto){
        return new CategoryDto(entity.id, entity.title);
    }
    public static fromMany(entity:CategoryDto[]){
        return entity.map(category=> CategoryDto.from(category))
    }
}