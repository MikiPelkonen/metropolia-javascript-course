"use strict";

const calculation = document.getElementById("calculation");
const startBtn = document.getElementById("start");
const resultParagraph = document.getElementById("result");
const alertParagraph = document.getElementById("alert");
const tokensParagraph = document.getElementById("tokens");

// Turn input string like "1+3.5-2*20/30" => [1,"+",3.5,"-",2,"*",20,"/",30]
function parseTokens(calculation) {
  // Regex match >> signs: [+\-*/] numbers: \d*\.?\d+
  return calculation
    .match(/(\d*\.?\d+|[+\-*/])/g)
    .map((op) => (isNaN(op) ? op : parseFloat(op)));
}

const OperatorFlags = {
  SUM: 1 << 0, // operators + and -
  PROD: 1 << 1, // operators * and /
};
// Allowed operators and freeze runtime mutability
const Operators = Object.freeze({
  ADD: { token: "+", flag: OperatorFlags.SUM },
  SUB: { token: "-", flag: OperatorFlags.SUM },
  MUL: { token: "*", flag: OperatorFlags.PROD },
  DIV: { token: "/", flag: OperatorFlags.PROD },
});

const AllowedOperators = new Set(
  Object.values(Operators).map((op) => op.token),
);

// Precompute flagged groups and freeze ^
const OperatorsByFlag = Object.freeze({
  [OperatorFlags.SUM]: new Set(
    Object.values(Operators)
      .filter((op) => op.flag === OperatorFlags.SUM)
      .map((op) => op.token),
  ),
  [OperatorFlags.PROD]: new Set(
    Object.values(Operators)
      .filter((op) => op.flag === OperatorFlags.PROD)
      .map((op) => op.token),
  ),
});

const OperatorMap = Object.freeze(
  Object.fromEntries(Object.values(Operators).map((op) => [op.token, op])),
);

function matchTokenTypes(flag = null, ...tokens) {
  const set = flag ? OperatorsByFlag[flag] : AllowedOperators;
  return tokens.every((token) => set.has(token));
}

// Check numbers and signs in correct order/syntax
function validateOperations(tokens) {
  if (!Array.isArray(tokens) || tokens.length === 0) return false;
  // Fail if first and last value is not a number
  if (isNaN(tokens[0]) || isNaN(tokens[tokens.length - 1])) return false;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    switch (i % 2) {
      case 0: // needs to be a number (int or float)
        if (isNaN(token)) return false;
        break;

      case 1: // needs to be an operator
        if (!matchTokenTypes(null, token)) return false;
        // no double operators
        if (isNaN(tokens[i - 1])) return false;
        break;
    }
  }
  return true; // Validation passed
}

const CalculatorState = Object.freeze({
  READY: "ready",
  PROD_OPERATIONS: "prod_operations",
  SUM_OPERATIONS: "sum_operations",
  SNAPSHOT: "snapshot",
  RESULT: "result",
});

// Generator func that runs the operations step by step
function* calculator(power = true) {
  let state = CalculatorState.READY;
  let tokens = [];
  while (power) {
    switch (state) {
      case CalculatorState.READY: {
        // Wait for operations e.g. [1,"+",2,"-",10.5]
        const received = yield {
          state: CalculatorState.READY,
          message: "waiting for operations",
        };
        tokens = Array.isArray(received) ? [...received] : [];
        if (!tokens.length) break;
        state = CalculatorState.PROD_OPERATIONS;
        yield {
          state: CalculatorState.SNAPSHOT,
          tokens: [...tokens],
          operation: null,
          highlight: null,
        };
        break;
      }
      case CalculatorState.PROD_OPERATIONS: {
        let operatorFound = false;
        // Loop through every operator position (odd indexes)
        for (let i = 1; i < tokens.length; i += 2) {
          const curOperator = tokens[i];
          if (matchTokenTypes(OperatorFlags.PROD, curOperator)) {
            // Remove [num, operator, num] from tokens e.g.[10, "*", 15]
            const [a, , b] = tokens.splice(i - 1, 3);
            const operator = OperatorMap[curOperator];
            // Calculate result
            const result =
              operator.token === Operators.MUL.token ? a * b : a / b;
            // Insert result back to same position
            tokens.splice(i - 1, 0, result);
            // Yield snapshot and operation to render
            const idx = i;
            yield {
              state: CalculatorState.SNAPSHOT,
              tokens: [...tokens],
              operation: `${a} ${operator.token} ${b} = ${result}`,
              highlight: [idx - 1, idx, idx + 1],
            };
            operatorFound = true;
            break; // Back to index 1 after every operation
          }
        }
        state = operatorFound
          ? CalculatorState.PROD_OPERATIONS
          : CalculatorState.SUM_OPERATIONS;
        break;
      }
      case CalculatorState.SUM_OPERATIONS: {
        let operatorFound = false;
        for (let i = 1; i < tokens.length; i += 2) {
          const curOperator = tokens[i];
          const idx = i;
          if (matchTokenTypes(OperatorFlags.SUM, curOperator)) {
            const [a, , b] = tokens.splice(i - 1, 3);
            const operator = OperatorMap[curOperator];
            const result =
              operator.token === Operators.ADD.token ? a + b : a - b;
            tokens.splice(i - 1, 0, result);
            // Yield snapshot and operation to render
            const idx = i;
            yield {
              state: CalculatorState.SNAPSHOT,
              tokens: [...tokens],
              operation: `${a} ${operator.token} ${b} = ${result}`,
              highlight: [idx - 1, idx, idx + 1],
            };
            operatorFound = true;
            break; // Back to index 1 after every operation
          }
        }
        state = operatorFound
          ? CalculatorState.SUM_OPERATIONS
          : CalculatorState.RESULT;
        break;
      }
      case CalculatorState.RESULT: {
        // Render final result
        yield {
          state: CalculatorState.RESULT,
          tokens: [...tokens],
          result: tokens[0],
          highlight: [0],
        };
        state = CalculatorState.READY;
        break;
      }
      default:
        state = CalculatorState.READY;
    }
  }
}

const tokenStyles = `
  font-family: system-ui;
  border: 1px solid black;
  padding: 0.25rem;
  margin: 0.25rem;
  display: inline-block;
`.trim();

function showSnapShot(tokens) {
  tokensParagraph.innerHTML = "";
  return tokens.forEach((token, i) => {
    const idx = i;
    const span = document.createElement("span");
    span.innerText = token;
    span.dataset.index = idx;
    span.style.cssText = tokenStyles;
    tokensParagraph.appendChild(span);
  });
}
function highlightTokens(indices) {
  indices.forEach((idx) => {
    const el = tokensParagraph.querySelector(`[data-index="${idx}"]`);
    if (!el) return;

    el.style.transition = "transform 0.3s ease, background 0.2s ease";
    el.style.transform = "scale(1.2) translateY(8px)";
    el.style.background = "yellow";

    setTimeout(() => {
      el.style.transform = "scale(1)";
      el.style.background = "";
    }, 280);
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runCalculator(ops) {
  const calc = calculator();
  calc.next(); // activate calculator => wait for operations
  let step = calc.next(ops);

  while (
    step.value !== undefined &&
    step.value.state !== CalculatorState.READY
  ) {
    const s = step.value.state;
    if (s === CalculatorState.SNAPSHOT) {
      showSnapShot(step.value.tokens);
      if (step.value.highlight) {
        await sleep(40);
        highlightTokens(step.value.highlight);
      }
      if (step.value.operation) {
        resultParagraph.innerText += step.value.operation + "\n";
      }
      await sleep(400);
    } else if (s === CalculatorState.RESULT) {
      // final result
      resultParagraph.innerText += step.value.result + "\n";
    }
    step = calc.next();
  }
}

const onStart = async (evt) => {
  evt.preventDefault();

  // Parse user input
  const ops = parseTokens(calculation.value);
  // Run validation
  if (!validateOperations(ops)) {
    alertParagraph.innerText =
      "Validation error.\nEnter operations in format: [num][operator]...[num]";
    return;
  }
  // Clear texts
  alertParagraph.innerText = "";
  resultParagraph.innerText = "";
  // Run calculator with fake sleep effect
  await runCalculator(ops);
};
startBtn.addEventListener("click", onStart);
