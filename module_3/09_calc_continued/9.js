"use strict";

document.body.style.cssText = `
      display: flex;
      flex-direction: column;
      place-items: center;
      min-height: 100vh;
      min-width: 320px;
      padding: 0;
      margin: 2rem auto;
      text-align: center;
      font-family: system-ui, 'sans-serif';
      font-size: 1rem;
      line-height: 1;
    `.trim();

document.querySelector("h1").style.cssText = `
    display: block;
    padding: 0;
    margin: 0;
    margin-top: 2rem;
    font-size: 2.4rem;
    color: #f5bde6;
    text-shadow: 0 1px 2px black;
    `.trim();

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

const TokenColors = Object.freeze({
  DEFAULT: "#F2E9E4", // soft rose-gray
  PROD: "#C9D6FF", // cool soft periwinkle (× and ÷ group)
  SUM: "#F7C59F", // warm peach ( + and - group )
  RESULT: "#B5E8A8", // fresh green highlight
  READY: "#FFE8A3", // warm light gold
  ADD: "#FFB386", // bright peach
  SUB: "#7FD1C8", // mint-turquoise
  MULTI: "#D6B4FE", // lavender-violet
  DIV: "#FF9BA7", // rose-pink
});

const OperatorColorMap = Object.freeze({
  "+": TokenColors.ADD,
  "-": TokenColors.SUB,
  "*": TokenColors.MULTI,
  "/": TokenColors.DIV,
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

const stateParagraph = document.getElementById("state");
stateParagraph.style.cssText = `
    position: absolute;
    top: 0.2rem;
    right: 0.1rem;
    display: flex;;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 35px;
    margin: 0;
    border: 1px inset silver;
    border-radius: 0.5rem;
    padding: 0.15rem 0;
    background: rgba(22,22,22,0.7);
    font-size: 0.65rem;
    `.trim();

const alertParagraph = document.createElement("p");
alertParagraph.id = "alert";
alertParagraph.style.cssText = `
    display: block;
    margin: 0;
    border: none;
    padding: 0;
    `.trim();

const calculation = document.getElementById("calculation");
calculation.style.cssText = `
      font-family: monospace;
      display: flex;
      width: 80%;
      height: 60px;
      text-align: center;
      padding: 1rem;
      font-size: 1.2rem;
      font-weight: 400;
      margin-top: 0.5rem;
      background-color: rgba(22,22,22,0.7);
      border-radius: 0.5rem;
      color: whitesmoke;
    `.trim();

const startBtn = document.getElementById("start");
startBtn.style.cssText = `
      display: block;
      width: 72%;
      text-align: center;
      margin-bottom: 1rem;
      padding: 1.25rem 0;
      font-size: 1.1rem;
      border: 2px solid silver;
      border-radius: 0.5rem;
      align-items: center;
`.trim();

const resultParagraph = document.getElementById("result");
resultParagraph.style.cssText = `
      font-family: monospace;
      background-color: #f5bde6;
      padding: 0.25rem;
      display: flex;
      flex-direction: column;
      width: 80%;
      height: 80%;
      align-items: center;
      justify-content: flex-end;
      overflow-y: scroll;
      border: 2px solid silver;
      border-radius: 0.5rem;
    `.trim();

const calcBase = document.getElementById("calc");
calcBase.style.cssText = `
  position: relative;
  display: flex;
  gap: 0.25rem;
  width: 500px;
  height: 720px;
  flex-direction: column;
  align-items: center;
  padding: 0.45rem;
  background-color: ${TokenColors.DEFAULT};
  border: 2px ridge silver;
  border-radius: 0.5rem;
  box-shadow: 1px 2px 6px rgba(22,22,22,0.7);
  box-sixing: border-box;
`.trim();

const calcScreen = document.getElementById("screen");
calcScreen.style.cssText = `
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 240px;
  padding: 0.15rem;
  border: 2px inset silver;
  border-radius: 0.5rem;
  background-color: rgba(44,44,44,0.7);
  box-sizing: border-box;
`.trim();

const tokensParagraph = document.createElement("p");
tokensParagraph.id = "tokens";
tokensParagraph.style.cssText = `
      display: flex;
      width: calc(100% - 0.15rem);
      max-height: calc(100% - 0.15rem);
      align-items: center;
      justify-content: center;
      gap: 2px;
      flex-wrap: wrap;
      padding: 0;
      margin: 0;
      box-sizing: border-box;
    `.trim();

const tokenStyles = `
  text-align: center;
  width: calc((100% / 5) - 0.5rem);
  font-size: 1.1rem;
  font-weight: 900;
  line-height: 1;
  padding: 0.42rem 0.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  color: whitesmoke;
  text-shadow: -0.8px -0.8px 0 rgba(22,22,22,0.9), 0.8px -0.8px 0 rgba(22,22,22,0.9), -0.8px 0.8px 0 rgba(22,22,22,0.9), 0.8px 0.8px 0 rgba(22,22,22,0.9);
  background: mintcream;
  border-radius: 0.15rem;
  box-shadow: 0 1px 4px rgba(22,22,22,0.4);
  transition: transform 0.2s ease-in-out, background 0.15s ease-in;
`.trim();

calcBase.appendChild(alertParagraph);
calcScreen.appendChild(tokensParagraph);

const opElRoot = document.getElementById("ops");
opElRoot.style.cssText = `
    display: flex;
    width: 100%;
    height: 40px;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    `.trim();

for (const [operator, color] of Object.entries(OperatorColorMap)) {
  const opEl = document.createElement("div");
  opEl.innerText = operator;
  opEl.style.cssText = `
    font-family: system-ui;
    font-size: 1.25rem;
    font-weight: 900;
    line-height: 0.4;
    color: whitesmoke;
    text-shadow: 0px -1px 2px rgba(22,22,22,0.4), 0 -1px 2px rgba(22,22,22,0.4), 0 1px 4px rgba(22,22,22,0.4), 0 1px 4px rgba(22,22,22,0.4);
    width: 40px;
    height: 37.5px;
    display: flex;
    padding: 0.75rem;
    align-items: center;
    justify-content: center;
    border: 2px solid silver;
    box-sizing: border-box;
    box-shadow: 0 1px 2px rgba(22,22,22,0.8);
    border-radius: 47.5%; 
    background: ${color};
    `.trim();
  opElRoot.append(opEl);
}

// Turn input string like "1+3.5-2*20/30" => [1,"+",3.5,"-",2,"*",20,"/",30]
function parseTokens(calculation) {
  // Regex match >> signs: [+\-*/] numbers: \d*\.?\d+
  return calculation
    .match(/(\d*\.?\d+|[+\-*/])/g)
    .map((op) => (isNaN(op) ? op : parseFloat(op)));
}

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
  return true; // Validation pass
}

const CalculatorState = Object.freeze({
  ON: "smol <(^^,)>",
  READY: "Standing by...",
  PROD_OPERATIONS: "Multiply & Divide",
  SUM_OPERATIONS: "Additive",
  SNAPSHOT: "snapshot",
  RESULT: "Final result",
});

function changeState(state, color) {
  stateParagraph.innerText = state;
  stateParagraph.style.color = color ?? "thistle";
  return state;
}

// Generator func that runs the operations step by step
function* calculator(power = true) {
  let state = changeState(CalculatorState.READY, TokenColors.READY);
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
        state = changeState(CalculatorState.PROD_OPERATIONS, TokenColors.PROD);
        yield {
          state: CalculatorState.SNAPSHOT,
          tokens: [...tokens],
          operation: null,
          highlight: Array.from(tokens.keys()),
          color: TokenColors.PROD,
        };
        break;
      }
      case CalculatorState.PROD_OPERATIONS: {
        let operatorFound = false;
        // Loop through every operator position (odd indexes)
        for (let i = 1; i < tokens.length; i += 2) {
          const curOperator = tokens[i];
          if (matchTokenTypes(OperatorFlags.PROD, curOperator)) {
            yield {
              state: CalculatorState.SNAPSHOT,
              tokens: [...tokens],
              highlight: [i - 1, i, i + 1],
              color: TokenColors.PROD,
              operator: tokens[i],
            };
            // Remove [num, operator, num] from tokens e.g.[10, "*", 15]
            const [a, , b] = tokens.splice(i - 1, 3);
            const operator = OperatorMap[curOperator];
            // Calculate result
            const result =
              operator.token === Operators.MUL.token ? a * b : a / b;
            // Insert result back to same position
            tokens.splice(i - 1, 0, result);
            // Yield snapshot and operation to render
            yield {
              state: CalculatorState.SNAPSHOT,
              tokens: [...tokens],
              operation: `${a} ${operator.token} ${b} = ${result}`,
            };
            operatorFound = true;
            break; // Back to index 1 after every operation
          }
        }
        state = operatorFound
          ? CalculatorState.PROD_OPERATIONS
          : changeState(CalculatorState.SUM_OPERATIONS, TokenColors.SUM);
        break;
      }
      case CalculatorState.SUM_OPERATIONS: {
        let operatorFound = false;
        for (let i = 1; i < tokens.length; i += 2) {
          const curOperator = tokens[i];
          if (matchTokenTypes(OperatorFlags.SUM, curOperator)) {
            yield {
              state: CalculatorState.SNAPSHOT,
              tokens: [...tokens],
              highlight: [i - 1, i, i + 1],
              color: TokenColors.SUM,
              operator: tokens[i],
            };
            const [a, , b] = tokens.splice(i - 1, 3);
            const operator = OperatorMap[curOperator];
            const result =
              operator.token === Operators.ADD.token ? a + b : a - b;
            tokens.splice(i - 1, 0, result);
            // Yield snapshot and operation to render
            yield {
              state: CalculatorState.SNAPSHOT,
              tokens: [...tokens],
              operation: `${a} ${operator.token} ${b} = ${result}`,
            };
            operatorFound = true;
            break; // Back to index 1 after every operation
          }
        }
        state = operatorFound
          ? CalculatorState.SUM_OPERATIONS
          : changeState(CalculatorState.RESULT, TokenColors.RESULT);
        break;
      }
      case CalculatorState.RESULT: {
        // Render final result
        yield {
          state: CalculatorState.RESULT,
          tokens: [...tokens],
          result: tokens[0],
          highlight: null,
          color: TokenColors.RESULT,
        };
        state = changeState(CalculatorState.READY, TokenColors.READY);
        break;
      }
      default:
        state = CalculatorState.READY;
    }
  }
}

function showSnapShot(tokens) {
  tokensParagraph.innerHTML = "";
  return tokens.forEach((token, i) => {
    if (!isNaN(token)) {
      if (!Number.isInteger(token)) {
        token = Number(token).toFixed(1);
      }
    }

    const idx = i;
    const span = document.createElement("span");
    span.innerText = token;
    span.dataset.index = idx;
    span.style.cssText = tokenStyles;
    tokensParagraph.appendChild(span);
  });
}

function highlightTokens(indices, fallbackColor, operator) {
  indices.forEach((idx) => {
    const color =
      OperatorColorMap[operator] || fallbackColor || TokenColors.DEFAULT;
    const el = tokensParagraph.querySelector(`[data-index="${idx}"]`);
    if (!el) return;

    el.style.transform = "scale(1.25) scaleX(0.65) translateY(-20px)";
    el.style.background = color;

    setTimeout(() => {
      el.style.transform = "scale(1)";
    }, 190);
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runCalculator(ops) {
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
        highlightTokens(
          step.value.highlight,
          step.value.color,
          step.value.operator,
        );
      }
      if (step.value.operation) {
        resultParagraph.innerText += step.value.operation + "\n";
      }

      await sleep(step.value.tokens.length > 2 ? 320 : 210);
    } else if (s === CalculatorState.RESULT) {
      // final result
      resultParagraph.innerText += step.value.result + "\n";
      const finalToken = tokensParagraph.querySelector('[data-index="0"]');
      await sleep(40);
      finalToken.style.background = "lightgreen";
      finalToken.style.transform = "scale(1.5)";
      await sleep(600);
    }
    step = calc.next();
  }
}

const onStart = async (evt) => {
  evt.preventDefault();
  startBtn.disabled = true;
  startBtn.textContent = "Calculating ...";

  // Parse user input
  const ops = parseTokens(calculation.value);
  // Run validation
  if (!validateOperations(ops)) {
    alertParagraph.innerText =
      "Validation error.\nEnter operations in format: [num][operator]...[num]";
    startBtn.textContent = "error";
    setTimeout(() => {
      startBtn.disabled = false;
      startBtn.textContent = "Calculate";
    }, 420);
    return;
  }
  // Clear texts
  alertParagraph.innerText = "";
  resultParagraph.innerText = "";
  // Run calculator with fake sleep effect
  await runCalculator(ops);
  startBtn.disabled = false;
  startBtn.textContent = "Calculate";
};

const calc = calculator();
changeState(CalculatorState.ON, TokenColors.READY);
startBtn.addEventListener("click", onStart);
