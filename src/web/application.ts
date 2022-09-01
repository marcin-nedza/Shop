import express, { NextFunction, Request, Response } from "express"
import { Container } from "inversify"
import { InversifyExpressServer } from "inversify-express-utils"
import { DBContext } from "../../src/data/db.context"
import { UserService } from "../../src/logic/services/users.service"
import {
  Application,
  IAbstractApplicationOptions,
} from "./lib/abstract-application"
import {
  UserRepository,
  CartRepository,
  ProductRepository,
} from "../data/repositories"
import {
  ValidationException,
  CouldNotFindException,
  CouldNotFindUserException,
  GenericError,
} from "../logic/exceptions"
import { BaseHttpResponse } from "./lib/base-http-response"
import { AuthenticationService } from "../logic/services/authentication.service"
import { ProductService } from "../logic/services/product.service"
import { JwtUtils } from "../logic/utils/jwt-utils"
import { CartService } from "../logic/services/cart.service"

import "./controllers/users.controllers"
import "./controllers/authentication.controller"
import "./controllers/product.controller"
import "./controllers/cart.controller"

export class App extends Application {
  public constructor() {
    super({
      containerOpts: {
        defaultScope: "Singleton",
      },
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

        next()
      })
    })
    server.setConfig((app) => {
      app.use(express.json())
    })
    const app = server.build()

    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on http://localhost:${process.env.PORT}`)
    })
  }
}
new App()
