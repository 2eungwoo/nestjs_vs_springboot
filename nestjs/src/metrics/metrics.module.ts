import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import {APP_INTERCEPTOR} from "@nestjs/core";
import {HttpMetricsInterceptor} from "./metrics.interceptor";

@Module({
  controllers: [MetricsController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpMetricsInterceptor,
    },
  ],
})
export class MetricsModule {}
