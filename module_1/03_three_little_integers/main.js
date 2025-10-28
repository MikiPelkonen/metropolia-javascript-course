"use strict";

const numbers = [];

for (let i = 0; i < 3; i++) {
  let num;
  do {
    num = Number(prompt(`Enter ${i + 1}. integer: `));
  } while (!Number.isInteger(num));
  numbers.push(num);
}

const sum = numbers.reduce((accumulator, currentValue) => {
  return accumulator + currentValue;
}, 0);

const product = numbers.reduce((accumulator, currentValue) => {
  return accumulator * currentValue;
}, 1);

const average = sum / numbers.length;

document.querySelector("#number-list").innerHTML =
  `Sum of integers: ${sum}<br> Product of integers: ${product}<br> Average of integers: ${average}`;
