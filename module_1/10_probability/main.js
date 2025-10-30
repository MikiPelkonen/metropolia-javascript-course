"use strict";

function rollDice(dice_count) {
  let total = 0;
  for (let i = 0; i < dice_count; i++) {
    total += Math.floor(Math.random() * 6) + 1;
  }
  return total;
}

function calculateProbability(dice_count, sum) {
  const sample_rate = 100000;
  let sum_count = 0;
  for (let i = 0; i < sample_rate; i++) {
    if (rollDice(dice_count) === sum) {
      sum_count += 1;
    }
  }
  return (sum_count / sample_rate) * 100;
}

let dice_count, sum;
do {
  dice_count = Number(prompt("Enter the number of dice to roll (n > 0):"));
} while (!Number.isInteger(dice_count) || dice_count <= 0);

do {
  sum = Number(prompt("Enter the sum:"));
} while (!Number.isInteger(sum) || sum < dice_count);

const dice_roll_result = calculateProbability(dice_count, sum);

document.querySelector("#probability-info").innerText =
  `The probability of rolling sum ${sum} with ${dice_count} dice is ${dice_roll_result.toFixed(2)}%.`;
