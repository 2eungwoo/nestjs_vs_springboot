import {Controller, Get, Header} from '@nestjs/common';
import {registry} from "./registry";

@Controller()
export class MetricsController {
  @Get('metrics')
  @Header('Content-Type', 'text/plain')
  getMetrics(): Promise<string> {
    return registry.metrics();
  }
}
