import {
  ArgumentsHost,
  CallHandler,
  Catch,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Request } from "express";
import { catchError, map, Observable, tap, throwError } from "rxjs";
import forge from "utils/forge";

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  constructor() {}

  private fyleDecrypter(obj?: { [key: string]: any }) {
    function _decrypter(datas: any) {
      if (!datas) {
        // ne rien faire
      } else if (Array.isArray(datas)) {
        for (let i = 0; i < datas.length; i++) {
          datas[i] = _decrypter(datas[i]);
        }
      } else if (Object.prototype.toString.call(datas) === "[object Object]") {
        if ("_FILE_" in datas) datas = datas._FILE_;
        else {
          for (const key in datas) {
            datas[key] = _decrypter(datas[key]);
          }
        }
      }

      return datas;
    }

    return _decrypter(obj);
  }

  private linkFyle(obj?: { [key: string]: any }) {
    function _decrypter(datas: any) {
      if (!datas) {
        // ne rien faire
      } else if (Array.isArray(datas)) {
        for (let i = 0; i < datas.length; i++) {
          datas[i] = _decrypter(datas[i]);
        }
      } else if (Object.prototype.toString.call(datas) === "[object Object]") {
        if (
          "content" in datas &&
          typeof datas.content === "string" &&
          datas.content.includes("base64")
        ) {
          datas.content = `${process.env.API_URL}/static/${datas.id}`;
        } else {
          for (const key in datas) {
            datas[key] = _decrypter(datas[key]);
          }
        }
      }

      return datas;
    }

    return _decrypter(obj);
  }

  _throwError(error: any) {
    if (process.env.NODE_ENV !== "production") {
      Logger.error(error);
    }

    if (error instanceof HttpException) return throwError(error);

    if (typeof error === "string") {
      return throwError(new HttpException(error, HttpStatus.BAD_REQUEST));
    }

    return throwError(
      new HttpException("internal_error", HttpStatus.INTERNAL_SERVER_ERROR),
    );
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.body && request.session) {
      request.body = this.fyleDecrypter(forge.session.decrypter(request.body));
    }

    return next.handle().pipe(
      map((data) => {
        console.log("++++++++", data);

        //   if (request.session) {
        //     data = forge.session.encrypter(data, request.session.publicKey);
        //   }

        data = this.linkFyle(data);

        return data;
      }),
      catchError((error) => {
        console.log("dfsfsdf");
        return this._throwError(error);
      }),
    );
  }
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : "Internal server error";

    console.error("Exception caught:", exception);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
