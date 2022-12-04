import cors from "cors"
import express, { NextFunction, Request, Response } from "express"
import { Container } from "inversify"
import { InversifyExpressServer } from "inversify-express-utils"
import morgan from "morgan"
import { DBContext } from "../../src/data/db.context"
import { StripeRepository } from "../../src/data/repositories"
import {
    AuthenticationService,
    CartService, CategoryService, ProductService, StripeService, UserService
} from "../../src/logic/services"
import {
    CartRepository, CategoryRepository, ProductRepository, UserRepository
} from "../data/repositories"
import {
    CouldNotFindException,
    CouldNotFindUserException,
    GenericError, ValidationException
} from "../logic/exceptions"
import { JwtUtils } from "../logic/utils/jwt-utils"
import "./controllers/authentication.controller"
import "./controllers/cart.controller"
import "./controllers/category.controller"
import "./controllers/product.controller"
import "./controllers/users.controllers"
import {
    Application,
    IAbstractApplicationOptions,
    MorganMode
} from "./lib/abstract-application"
import { BaseHttpResponse } from "./lib/base-http-response"


export class App extends Application {
  public constructor() {
    super({
      containerOpts: {
        defaultScope: "Singleton",
      },
      morgan: {
        mode: MorganMode.DEV,
      },
    })
  }
  public configureServices(container: Container): void {
    container.bind(DBContext).toSelf()
    container.bind(StripeRepository).toSelf()
    container.bind(UserRepository).toSelf()
    container.bind(ProductRepository).toSelf()
    container.bind(CartRepository).toSelf()
    container.bind(UserService).toSelf()
    container.bind(AuthenticationService).toSelf()
    container.bind(ProductService).toSelf()
    container.bind(CartService).toSelf()
    container.bind(CategoryRepository).toSelf()
    container.bind(CategoryService).toSelf()
    container.bind(StripeService).toSelf()
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

        if (err instanceof Error) {
          const response = BaseHttpResponse.failed(err.message, 500)

          return res.status(response.statusCode).json(response)
        }
        next()
      })
    })
    server.setConfig((app) => {
      app.use(express.json())
      app.use(
        cors({
          origin:process.env.HOST_URL ??  "http://localhost:3000",
          credentials: true,
        })
      )
      app.use(morgan(options.morgan.mode))
    })
    const app = server.build()

    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on ${process.env.PORT}`)
    })
  }
}
new App()
