import { IUserModel } from "src/data/user.model";

export class UserDto {
    public constructor(
        public readonly id: string,
        public readonly username: string,
        public readonly email: string,
        public readonly password: string,

    ){}
    public static from(entity:IUserModel){
        return new UserDto(entity.id, entity.username, entity.email, entity.password);
    }
    public static fromMany(users:IUserModel[]){
        return users.map(user=>UserDto.from(user)) 
    }
}