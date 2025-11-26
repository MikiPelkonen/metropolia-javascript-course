"use strict";

const num1 = document.getElementById("num1");
const num2 = document.getElementById("num2");
const operation = document.getElementById("operation");
const startBtn = document.getElementById("start");
const result = document.getElementById("result");

function calculate(a, b, op) {
  let opResult;
  switch (op) {
    case "add":
      opResult = a + b;
      break;
    case "sub":
      opResult = a - b;
      break;
    case "multi":
      opResult = a * b;
      break;
    case "div":
      opResult = a / b;
      break;
    default:
      break;
  }
  if (opResult) {
    result.textContent = opResult;
  }
}

const onStart = (evt) => {
  evt.preventDefault();
  const a = Number(num1.value),
    b = Number(num2.value);
  const op = operation.value;
  calculate(a, b, op);
};

startBtn.onclick = onStart;
