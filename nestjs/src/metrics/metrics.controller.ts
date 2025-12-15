import { Controller, Get, Header } from '@nestjs/common';
import { Registry, collectDefaultMetrics } from 'prom-client';

const registry = new Registry();
collectDefaultMetrics({ register: registry });

@Controller()
export class MetricsController {
  @Get('metrics')
  @Header('Content-Type', 'text/plain')
  getMetrics(): Promise<string> {
    return registry.metrics();
  }
}
