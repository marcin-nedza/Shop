export class CouldNotFindUserException extends Error{
    public constructor() {
        super('Missing user')
    }
}