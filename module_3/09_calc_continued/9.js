"use strict";

const calculation = document.getElementById("calculation");
const startBtn = document.getElementById("start");
const resultP = document.getElementById("result");

function parseOperation(calculation) {
  return calculation
    .match(/(\d*\.?\d+|[+\-*/])/g)
    .map((op) => (isNaN(op) ? op : parseFloat(op)));
}

function* calculator() {
  const input = calculation.value;
  const operations = parseOperation(input);
  yield operations;
  let stack = [];
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    if (op === "*" || op === "/") {
      const previous = stack.pop();
      const next = operations[i + 1];
      const result = op === "*" ? previous * next : next / previous;
      stack.push(result);
      i++;
      yield [previous, op, next];
    } else {
      stack.push(op);
    }
    yield stack;
  }

  let calcResult = stack[0];
  for (let i = 1; i < stack.length; i += 2) {
    const op = stack[i];
    const num = stack[i + 1];
    if (op === "+") {
      calcResult += num;
    } else if (op === "-") {
      calcResult -= num;
    }
    yield calcResult;
  }

  yield calcResult;
}

const calcGen = calculator();

const onStart = (evt) => {
  evt.preventDefault();
  let result;
  while (!(result = calcGen.next()).done) {
    console.log(`Result:${result.value}`);
    resultP.innerText += result.value + "\n";
  }
};
startBtn.onclick = onStart;
