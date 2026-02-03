let balance = 1000;

async function withdraw(amount: number) {
  if (balance >= amount) {
    await fakeDelay(); // DB/network delay
    balance -= amount;
  }
}
let balance = 0;

function refund(amount: number) {
  balance -= amount;
}

refund(100); // balance = -100 ❌
