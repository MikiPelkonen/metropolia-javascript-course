"use strict";

function checkForPrimeNumber(number) {
  if (number <= 1) {
    return false;
  } else if (number === 2) {
    return true;
  } else {
    for (let i = 2; i <= Math.sqrt(number); i++) {
      if (number % i === 0) return false;
    }
  }
  return true;
}

const integerPrompt = "Enter an integer:";

let user_input;

do {
  user_input = Number(prompt(integerPrompt));
} while (!Number.isInteger(user_input));

const checkedNumber = checkForPrimeNumber(user_input);
document.querySelector("#prime-info").innerHTML =
  `Number ${user_input} is ${checkedNumber ? "" : "not"} a prime number.`;
