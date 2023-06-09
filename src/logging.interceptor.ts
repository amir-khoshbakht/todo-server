import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    const req = context.switchToHttp().getRequest() as Request;
    console.log(`Path: ${req.path}`);
    console.log(`Method: ${req.method}`);
    console.log(JSON.parse(JSON.stringify(req.headers)));
    console.log('---------------------------------------------');
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        console.log(`After... ${Date.now() - now}ms`);
        console.log('---------------------------------------------');
      }),
    );
  }
}
