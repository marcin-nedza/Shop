export class BaseHttpResponse {
    public constructor(
        public readonly data:any ={},
        public readonly error:string |null = null,
        public readonly statusCode:number,
    ){}
    public static success(data:any,statusCode=200){
        return new BaseHttpResponse(data,null,statusCode)
    }
    public static failed(msg:string,statusCode=400){
        return new BaseHttpResponse(null,msg,statusCode)
    }
}