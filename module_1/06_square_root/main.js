"use strict";

const confirmation = confirm("Should i calculate the square root?");
console.log(confirmation);

let result_msg;
let input_number;
if (confirmation) {
  do {
    input_number = Number(prompt("Enter a number:"));
  } while (!Number.isInteger(input_number));
  switch (input_number) {
    case input_number < 0:
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
