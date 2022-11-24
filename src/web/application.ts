import express, {  NextFunction, Request, Response } from "express"
import cors from 'cors'
import { Container } from "inversify"
import { InversifyExpressServer } from "inversify-express-utils"
import { DBContext } from "../../src/data/db.context"
import {
  UserService,
  AuthenticationService,
  CartService,
  ProductService,
  CategoryService
} from "../../src/logic/services"
import {
  Application,
  IAbstractApplicationOptions,
  MorganMode,
} from "./lib/abstract-application"
import {
  UserRepository,
  CartRepository,
  ProductRepository,
  CategoryRepository
} from "../data/repositories"
import {
  ValidationException,
  CouldNotFindException,
  CouldNotFindUserException,
  GenericError,
} from "../logic/exceptions"
import { BaseHttpResponse } from "./lib/base-http-response"
import { JwtUtils } from "../logic/utils/jwt-utils"
import morgan from 'morgan'

import "./controllers/users.controllers"
import "./controllers/authentication.controller"
import "./controllers/product.controller"
import "./controllers/cart.controller"
import "./controllers/category.controller"

export class App extends Application {
  public constructor() {
    super({
      containerOpts: {
        defaultScope: "Singleton",
      },
      morgan:{
        mode:MorganMode.DEV
      }
    })
  }
  public configureServices(container: Container): void {
    container.bind(DBContext).toSelf()
    container.bind(UserRepository).toSelf()
    container.bind(ProductRepository).toSelf()
    container.bind(CartRepository).toSelf()
    container.bind(UserService).toSelf()
    container.bind(AuthenticationService).toSelf()
    container.bind(ProductService).toSelf()
    container.bind(CartService).toSelf()
    container.bind(CategoryRepository).toSelf()
    container.bind(CategoryService).toSelf()
    container.bind(JwtUtils).toSelf()
  }

  public async setup(options: IAbstractApplicationOptions) {
    const _db = this.container.get(DBContext)
    await _db.connect()
    const server = new InversifyExpressServer(this.container)

    server.setErrorConfig((app) => {
      //TODO: Move this to seperate file
      app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof ValidationException) {
          const response = BaseHttpResponse.failed(err.message, 400)
          return res.status(response.statusCode).json(response)
        }

        if (err instanceof CouldNotFindException) {
          const response = BaseHttpResponse.failed(err.message, 404)
          return res.status(response.statusCode).json(response)
        }

        if (err instanceof CouldNotFindUserException) {
          const response = BaseHttpResponse.failed(err.message, 404)
          res.status(response.statusCode).json(response)
        }

        if (err instanceof GenericError) {
          const response = BaseHttpResponse.failed(err.message, 401)
          return res.status(response.statusCode).json(response)
        }

        if(err instanceof Error){
          const response = BaseHttpResponse.failed(err.message, 500)
        console.log('errHandler',response);
               
          return res.status(response.statusCode).json(response)
        }
        next()
      })
    })
    server.setConfig((app) => {
      app.use(express.json())
      app.use(cors({
        origin:process.env.HOST_URL,
        credentials:true
      }))
      app.use(morgan(options.morgan.mode))
    })
    const app = server.build()

    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on ${process.env.PORT}`)
    })
  }
}
new App()
