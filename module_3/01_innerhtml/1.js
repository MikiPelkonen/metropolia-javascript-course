"use strict";

const ul = document.getElementById("target");
const idxStrings = ["First", "Second", "Third"];
for (const idx of idxStrings) {
  ul.innerHTML += `<li>${idx} item</li<`;
}
