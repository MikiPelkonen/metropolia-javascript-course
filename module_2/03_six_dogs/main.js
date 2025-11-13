"use strict";

const body = document.body;
const style = document.createElement("style");
style.textContent = `
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem;
    }
`;
document.head.appendChild(style);

const dogForm = document.createElement("form");
const inputLabel = document.createElement("label");
inputLabel.innerText = "Enter dog names:";
dogForm.appendChild(inputLabel);
for (let i = 0; i < 6; i++) {
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.name = `${i} dog`;
  inputField.placeholder = `${i + 1}. dog`;
  dogForm.appendChild(inputField);
}
const submitButton = document.createElement("input");
submitButton.type = "submit";
submitButton.value = "Submit";
dogForm.appendChild(submitButton);
body.appendChild(dogForm);

const unorderedList = document.createElement("ul");
body.appendChild(unorderedList);

dogForm.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.tagName === "INPUT") {
    e.preventDefault();
  }
});

dogForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  unorderedList.replaceChildren();
  const dogNames = Array(6).fill("");
  for (let i = 0; i < 6; i++) {
    const name = dogForm[`${i} dog`].value;
    dogNames[i] = name;
  }
  for (let dogName of dogNames.sort().reverse()) {
    const listItem = document.createElement("li");
    listItem.innerText = dogName;
    unorderedList.appendChild(listItem);
    console.log(dogName);
  }
});
