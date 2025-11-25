"use strict";

const calculation = document.getElementById("calculation");
const startBtn = document.getElementById("start");
const resultParagraph = document.getElementById("result");

function parseOperation(calculation) {
  // Regex match
  // ints + floats: \d*\.?\d+
  // signs: [+\-*/]
  return calculation
    .match(/(\d*\.?\d+|[+\-*/])/g)
    .map((op) => (isNaN(op) ? op : parseFloat(op)));
}

const validSigns = ["+", "-", "/", "*"];

function validateOperations(operations) {
  for (let i = 0; i < operations.length; i++) {
    if (i % 2 === 0) {
      if (isNaN(operations[i])) return false;
    } else {
      if (!validSigns.some((sign) => sign === operations[i])) return false;
    }
  }
  return true;
}

function* calculator() {
  while (true) {
    const received = yield {
      type: "ready",
      message: "waiting for operations",
    };

    const operations = Array.isArray(received) ? [...received] : [];

    if (!operations.length) continue;
    yield { type: "ops:", value: operations.slice().join(" ") };

    let stack = [];
    let opCount = 1;

    for (let i = 0; i < operations.length; i++) {
      const op = operations[i];
      if (op === "*" || op === "/") {
        const previous = stack.pop();
        const next = operations[i + 1];
        const result = op === "*" ? previous * next : previous / next;
        yield {
          type: `${opCount}. op:`,
          value: `${previous} ${op} ${next} = ${result}`,
        };
        stack.push(result);
        i++;
        opCount++;
      } else {
        stack.push(op);
      }
    }

    yield {
      type: "remaining",
      value: stack,
    };
    let calcResult = stack[0];
    for (let i = 1; i < stack.length; i += 2) {
      const op = stack[i];
      const num = stack[i + 1];
      yield {
        type: `${opCount}. op:`,
        value: `${calcResult} ${op} ${num}`,
      };
      calcResult = op === "+" ? calcResult + num : calcResult - num;
      opCount++;
    }
    // Final
    yield { type: "result", value: calcResult };
  }
}

const calcGen = calculator();
calcGen.next();

const onStart = (evt) => {
  evt.preventDefault();
  const ops = parseOperation(calculation.value);
  if (!validateOperations(ops)) {
    alert("Validation error on operation stack.");
    return;
  }

  resultParagraph.innerText = "";

  let step = calcGen.next(ops);
  while (step.value !== undefined && step.value.type !== "ready") {
    resultParagraph.innerText +=
      `${step.value.type} ${step.value.value}` + "\n";
    step = calcGen.next();
  }
};
startBtn.addEventListener("click", onStart);
