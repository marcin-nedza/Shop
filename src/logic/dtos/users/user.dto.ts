import {User} from "@prisma/client"
export class UserDto {
    public constructor(
        public readonly id: string,
        public readonly username: string,
        public readonly email: string,
        public readonly role:"ADMIN"|"USER",
        public readonly password?: string,

    ){}
    public static from(entity:User){
        return new UserDto(entity.id, entity.username, entity.email,entity.role );
    }
    public static fromMany(users:User[]){
        return users.map(user=>UserDto.from(user)) 
    }
}