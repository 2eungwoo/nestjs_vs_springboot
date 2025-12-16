import http from 'k6/http';
import { check, sleep } from 'k6';
import { SPRING_URL } from './config.js';

export const options = {
  scenarios: {
    readAll: {
      executor: 'constant-arrival-rate',
      rate: 1,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 2,
    },
  },
};

export default function readOrders() {
  const res = http.get(`${SPRING_URL}/orders/v1`);
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}
