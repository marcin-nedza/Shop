/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { BaseMiddleware } from "../lib/base-middleware"

export class ValidateRequestMiddleware extends BaseMiddleware {
  public constructor(
    private readonly _DtoClass: { from: any },
    private readonly _withParams = false,
    private readonly _withParamsAndQuery = false,
  ) {
    super()
  }
  public execute(
    req: Request,
    res: Response,
    next: NextFunction
  ): void | Promise<void> {
    if (this._withParams) {
      //if there is params then we add them to the request body
      req.body = {
        ...req.body,
        ...req.params,
      }
    }
    if(this._withParamsAndQuery){
      req.body = {
        ...req.body,
        ...req.query,
        ...req.params,
        }
    }
    req.body = this._DtoClass.from(req.body)
    next()
  }

  public static with(dto: any) {
    return new ValidateRequestMiddleware(dto, false).execute
  }

  public static withParams(dto: any) {
    return new ValidateRequestMiddleware(dto, true).execute
  }

  public static withParamsAndQuery(dto: any) {
    return new ValidateRequestMiddleware(dto,false, true).execute
    }
}
