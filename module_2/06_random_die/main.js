"use strict";

function randInt(start, stop) {
  return Math.floor(Math.random() * stop) + start;
}

function rollDie() {
  const start = 1,
    stop = 6;
  return randInt(start, stop);
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function* rollDiceAsync() {
  let result;
  do {
    await timeout(200);
    result = rollDie();

    yield result;
  } while (result !== 6);
}

(async () => {
  const ul = document.createElement("ul");
  document.body.appendChild(ul);

  const diceRoller = rollDiceAsync();
  for await (const result of diceRoller) {
    console.log(`Rolling result: ${result}`);
    const li = document.createElement("li");
    li.textContent = result;
    ul.appendChild(li);
  }
})();
