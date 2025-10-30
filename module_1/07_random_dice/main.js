"use strict";

function rollDice(dice_count) {
  let total = 0;
  for (let i = 0; i < dice_count; i++) {
    total += Math.floor(Math.random() * 6) + 1;
  }
  return total;
}

let dice_count;
do {
  dice_count = Number(prompt("Enter the number of dice to roll (n > 0):"));
} while (!Number.isInteger(dice_count) || dice_count <= 0);

const dice_roll_result = rollDice(dice_count);

document.querySelector("#dice-results").innerHTML =
  `The result of rolling ${dice_count} dice is ${dice_roll_result}.`;
