"use strict";
const houses = ["Gryffindor", "Slytherin", "Hufflepuff", "Ravenclaw"];
const username = prompt("Enter your name: ");
document.querySelector("#greet").innerHTML =
  `${username}, you are ${houses[Math.floor(Math.random() * houses.length)]}!`;
