"use strict";

const PROMPT_MSG = "Enter a number (0 to exit):";

function promptNumbers() {
  const numArray = [];
  let input;
  let num;
  do {
    input = prompt(PROMPT_MSG);
    if (input === "") {
      continue;
    }
    num = Number(input);
    if (Number.isNaN(num)) {
      console.warn("Invalid input", input);
      continue;
    }
    if (num === 0) break;
    numArray.push(num);
  } while (num !== 0);
  return numArray;
}

function printResults(numberList) {
  for (let n of numberList.sort((a, b) => b - a)) {
    console.log(n);
  }
}

printResults(promptNumbers());
