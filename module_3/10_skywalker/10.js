"use strict";

const source = document.getElementById("source");
const targetP = document.getElementById("target");

function onFormSubmit(evt) {
  evt.preventDefault();
  const firstName = document.forms["source"]["firstname"]?.value;
  const lastName = document.forms["source"]["lastname"]?.value;
  targetP.innerText = `Your name is ${
    firstName
      ? (
          firstName.slice(0, 1).toUpperCase() + firstName.slice(1).toLowerCase()
        ).trim()
      : ""
  } ${lastName ? (lastName.slice(0, 1).toUpperCase() + lastName.slice(1).toLowerCase()).trim() : ""}`;
}

source.addEventListener("submit", onFormSubmit);
