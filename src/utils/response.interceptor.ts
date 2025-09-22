import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        return {
          message: 'Operação realizada com sucesso.',
          statusCode: context.switchToHttp().getResponse().statusCode,
          data: data,
        };
      }),
      catchError((err) => {
        const status = err.getStatus ? err.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        return throwError(() => new HttpException({
          message: err.response?.message || err.message || 'Erro inesperado ocorreu',
          statusCode: status,
          data: null,
        }, status));
      }),
    );
  }
}
