import http from "k6/http";
import { sleep } from "k6";

export const options = { vus: 1, iterations: 100 };

let expectedBalance = 10024.2;

export default function () {
  const start = Date.now();
  const payload = JSON.stringify({
    fromAccount: "user1",
    toAccount: "user2",
    amount: 0.1,
    currency: "USD",
  });
  http.post("http://localhost:3001/wallets/balanceTransfer", payload, {
    headers: { "Content-Type": "application/json" },
  });

  let consistent = false;
  while (!consistent) {
    const res = http.get("http://localhost:3001/wallets/user2/balance");
    const balance = JSON.parse(res.body).balance;
    if (balance >= expectedBalance) {
      consistent = true;
      expectedBalance = balance;
    } else sleep(0.1);
  }
  console.log(`Consistency delay: ${Date.now() - start} ms`);
}
