"use strict";

const confirmation = confirm("Should I calculate the square root?");

let result_msg;
let input_number;
if (confirmation) {
  do {
    input_number = Number(prompt("Enter a number:"));
  } while (!Number.isInteger(input_number));
  switch (Math.sign(input_number)) {
    case -1:
      result_msg = "The square root of a negative number is not defined.";
      break;
    default:
      const square_root = Math.sqrt(input_number);
      result_msg = `The square root of number ${input_number} is ${square_root}.`;
      break;
  }
} else {
  result_msg = "The square root is not calculated.";
}

document.querySelector("#greet").innerHTML = result_msg;
