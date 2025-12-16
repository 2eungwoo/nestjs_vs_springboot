import { Counter, Histogram } from 'prom-client';

export const httpRequestCounter = new Counter({
  name: 'http_server_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status'],
});

export const httpRequestDuration = new Histogram({
  name: 'http_server_requests_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'path', 'status'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});