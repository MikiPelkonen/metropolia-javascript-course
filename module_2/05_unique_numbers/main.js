"use strict";

const PROMPT_MSG = "Enter a unique number:";

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
    if (numArray.includes(num)) {
      console.log(`Number: ${num} already given. Printing results...`);
      break;
    }
    numArray.push(num);
  } while (true);
  return numArray;
}

function printResults(numberList) {
  for (let n of numberList.sort()) {
    console.log(n);
  }
}

printResults(promptNumbers());
