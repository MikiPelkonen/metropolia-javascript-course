"use strict";

const body = document.body;
const unorderedList = document.createElement("ul");
body.appendChild(unorderedList);

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

let dieResult;
do {
  dieResult = rollDie();
  const li = document.createElement("li");
  li.textContent = dieResult;
  unorderedList.appendChild(li);
} while (dieResult !== 6);
