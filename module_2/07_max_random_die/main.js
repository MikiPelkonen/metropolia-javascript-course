"use strict";

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function randInt(start, stop) {
  return Math.floor(Math.random() * stop) + start;
}

function rollDie(sideCount) {
  const start = 1;
  return randInt(start, sideCount);
}

function promptUser() {
  const promptMsg = "Enter the number of sides in a die:";
  let input;
  let result;
  while (true) {
    input = prompt(promptMsg);

    if (input === "") continue;
    if (input === null) continue;

    result = Number(input);

    if (!Number.isInteger(result) || result <= 1) {
      console.warn(
        "Invalid input. Enter a valid integer number greater than 1.",
        input,
      );
      continue;
    }
    return result;
  }
}

async function* rollDiceAsync() {
  const sideCount = promptUser();
  let result;
  do {
    await timeout(200);
    result = rollDie(sideCount);
    yield result;
  } while (result !== sideCount);
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
