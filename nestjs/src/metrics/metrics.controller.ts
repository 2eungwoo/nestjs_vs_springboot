import {Controller, Get, Header} from '@nestjs/common';
import {metricsRegistry} from "./metrics.registry";

@Controller()
export class MetricsController {
  @Get('metrics')
  @Header('Content-Type', 'text/plain')
  getMetrics(): Promise<string> {
    return metricsRegistry.metrics();
  }
}
