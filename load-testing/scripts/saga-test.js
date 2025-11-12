import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 500 },
    { duration: "1m", target: 500 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<200"],
  },
};

export default function () {
  const payload = JSON.stringify({
    fromAccount: "user1",
    toAccount: "user2",
    amount: 0.1,
    currency: "USD",
  });
  const params = { headers: { "Content-Type": "application/json" } };
  const res = http.post(
    "http://localhost:3000/wallets/balanceTransfer",
    payload,
    params
  );
  check(res, { "status 201": (r) => r.status === 201 });
  sleep(0.5);
}
