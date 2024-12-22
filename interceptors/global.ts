import {
  ArgumentsHost,
  CallHandler,
  Catch,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Request } from "express";
import { catchError, map, Observable, throwError } from "rxjs";
import { getLibellys } from "utils/error";
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
          delete datas.content;
          datas.url = `${process.env.API_URL}/static/${datas.id}`;
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

    if (error instanceof HttpException) {
      console.log(error.message);

      const messages = {};
      for (const label of error.message.split(";")) {
        messages[label] = getLibellys(label);
      }

      error.message = JSON.stringify({
        label: error.message,
        translate: messages,
      });

      return throwError(new HttpException(error.message, error.getStatus()));
    }

    if (typeof error === "string") {
      const messages = {};

      for (const label of error.split(";")) {
        messages[label] = getLibellys(label);
      }

      error = JSON.stringify({
        label: error,
        translate: messages,
      });

      return throwError(new HttpException(error, HttpStatus.BAD_REQUEST));
    }

    return throwError(
      new HttpException(
        JSON.stringify({
          label: "internal_error",
          translate: getLibellys("internal_error"),
        }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
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
        if (request.session) {
          data = forge.session.encrypter(data, request.session.publicKey);
        }

        data = this.linkFyle(data);

        return data;
      }),
      catchError((error) => {
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
