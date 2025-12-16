import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  httpRequestCounter,
  httpRequestDuration,
} from './metrics.http';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const path = req.route?.path || 'unknown';
    const start = Date.now();

    return next.handle().pipe(
        tap(() => {
          const res = context.switchToHttp().getResponse();
          const status = res.statusCode.toString();
          const duration = (Date.now() - start) / 1000;

          httpRequestCounter.inc({ method, path, status });
          httpRequestDuration.observe(
              { method, path, status },
              duration,
          );
        }),
    );
  }
}