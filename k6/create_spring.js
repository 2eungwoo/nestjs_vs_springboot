import http from 'k6/http';
import { check, sleep } from 'k6';
import {SPRING_URL, BATCH_SIZE} from './config.js';

const payload = JSON.stringify(
  Array.from({ length: BATCH_SIZE }).map((_, idx) => ({
    productName: `product-${idx}`,
    quantity: Math.floor(Math.random() * 10) + 1,
    price: Math.floor(Math.random() * 10000) + 1000,
  })),
);

export const options = {
  scenarios: {
    insert: {
      executor: 'constant-arrival-rate',
      rate: 2,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 5,
    },
  },
};

export default function createOrders() {
  const res = http.post(`${SPRING_URL}/orders`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'status 200/201': (r) => r.status === 200 || r.status === 201 });
  sleep(1);
}
