import express from 'express'
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import { DBContext } from "src/data/db.context";
import { UserRepository } from 'src/data/user.repository';
import { UserService } from 'src/logic/services/users.service';
import { Application, IAbstractApplicationOptions } from "./lib/abstract-application";


import './controllers/users.controllers'
import { ValidationException } from 'src/logic/exceptions/validation-exception';
import { BaseHttpResponse } from './lib/base-http-response';
import { PrismaClientValidationError } from '@prisma/client/runtime';




export class App extends Application {
    public constructor() {
        super({
            containerOpts:{
                defaultScope:"Singleton"
            }
        })
    }
    public configureServices(container: Container): void {
        container.bind(DBContext).toSelf()
        container.bind(UserRepository).toSelf()
        container.bind(UserService).toSelf()
    }
    public async setup(options:IAbstractApplicationOptions){
        const _db = this.container.get(DBContext)
        await _db.connect()

        const server  = new InversifyExpressServer(this.container)

        server.setErrorConfig((app)=>{
            app.use((err,req,res,next)=>{
                if(err instanceof ValidationException){
                    const response = BaseHttpResponse.failed(err.message,400)
                    return res.status(response.statusCode).json(response)
                }
                if(err instanceof Error){
                    const response = BaseHttpResponse.failed(err.message,500)
                    res.status(response.statusCode).json(response)
                }
       
                next()
            })
        })
        server.setConfig((app)=>{
            app.use(express.json())
            
        })
        const app = server.build()

        app.listen(process.env.PORT,()=>{
            console.log(`Server is listening on http://localhost:${process.env.PORT}`)
        })
    }
}
new App()