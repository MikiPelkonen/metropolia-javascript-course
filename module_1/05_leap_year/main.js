"use strict";

let user_input;

function checkForLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

do {
  user_input = Number(prompt("Enter a year number:"));
} while (!Number.isInteger(user_input));

document.querySelector("#greet").innerHTML =
  `Year ${user_input} is ${checkForLeapYear(user_input) ? "" : "not"} a leap year.`;
