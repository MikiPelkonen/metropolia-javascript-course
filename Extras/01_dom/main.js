"use strict";

const body = document.body;
const p = document.createElement("p");
p.innerText = "Paragraph";
body.appendChild(p);
const div = document.createElement("div");
const heading = document.createElement("h1");
heading.innerText = "Heading";
div.appendChild(heading);
body.appendChild(div);

const ul = document.createElement("ul");

for (let i = 0; i < 2; i++) {
  const li = document.createElement("li");
  li.innerText = `${i + 1}. list item`;
  ul.appendChild(li);
}

div.appendChild(ul);

const button = document.createElement("button");
button.innerText = "Drag Me";

let startX, startY;

button.addEventListener("pointerdown", (evt) => {
  button.setPointerCapture(evt.pointerId);
  startX = evt.clientX;
  startY = evt.clientY;
  button.style.transition = "transform 0.2s ease";
  console.log(`Pointer with ID: ${evt.pointerId} captured.`);
});

button.addEventListener("pointermove", (evt) => {
  if (button.hasPointerCapture(evt.pointerId)) {
    console.log(`Pointer with ID: ${evt.pointerId} on move.`);
    button.style.transform = `translate(${evt.clientX - startX}px, ${evt.clientY - startY}px)`;
  }
});

button.addEventListener("pointerup", (evt) => {
  if (button.hasPointerCapture(evt.pointerId)) {
    button.releasePointerCapture(evt.pointerId);
    console.log(`Pointer with ID: ${evt.pointerId} released.`);
    button.style.transition = "transform 1s cubic-bezier(0.15, -0.75, 0.25, 1)";
    button.style.transform = `translate(0)`;
  }
});

div.appendChild(button);
