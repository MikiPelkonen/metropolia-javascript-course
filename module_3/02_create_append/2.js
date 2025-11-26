"use strict";

const ul = document.getElementById("target");
const idxStrings = ["First", "Second", "Third"];
idxStrings.forEach((idxStr, idx) => {
  const li = document.createElement("li");
  if (idx === 1) li.classList.add("my-item");
  li.textContent = `${idxStr} item`;
  ul.appendChild(li);
});
