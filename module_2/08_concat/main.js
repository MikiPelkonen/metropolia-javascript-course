"use strict";

function concat(strArray) {
  return strArray.reduce((previous, current) => previous + current, "");
}

const strArr = ["First", "Second", "Third", "Fourth", "Fifth"];
const result = concat(strArr);

const paragraph = document.createElement("p");
paragraph.textContent = result;
document.body.appendChild(paragraph);
