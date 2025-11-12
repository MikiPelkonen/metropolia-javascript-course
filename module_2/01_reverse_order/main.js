"use strict";

const body = document.body;
const style = document.createElement("style");
style.textContent = `
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    p {
      display: inline-block;
      padding: 0.75rem;
      font-size: 1rem;
      line-height: 1.6;
      background-color: rgba(22,22,22,0.3);
      border: 1px inset silver;
      border-top-width: 4px;
      border-left-width: 4px;
      border-radius: 1rem;
      box-shadow: 1px 3px 6px rgba(22,22,22,0.3);
    }

    p:nth-child(2) {
      background-color: orange;
      border: 1px inset red;
    }
`;
document.head.appendChild(style);

const resultParagraph = document.createElement("p");
body.appendChild(resultParagraph);

const errorParagraph = document.createElement("p");
body.appendChild(errorParagraph);

function promptNum(promptMsg) {
  const timeoutMs = 50;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rawInput = prompt(promptMsg)?.trim();
      if (rawInput === "" || isNaN(rawInput) || rawInput === null)
        reject(`Invalid input: ${rawInput}. Needs to be a number.`);
      resolve(Number(rawInput));
    }, timeoutMs);
  });
}

async function promptFiveTimes() {
  const num_array = Array(5).fill(0);
  let errorMsg = "";
  let i = 0;
  while (i < num_array.length) {
    await promptNum(`Enter ${i + 1}. number`)
      .then((promptedNumber) => {
        if (errorMsg !== "") {
          errorParagraph.innerText = "";
          errorMsg = "";
        }
        num_array[i] = promptedNumber;
        resultParagraph.innerText += `Index: ${i} result: ${promptedNumber}\n`;
        i++;
      })
      .catch((err) => {
        errorMsg = `Error: ${err}`;
        console.log(errorMsg);
        errorParagraph.innerText = errorMsg;
      });
  }
  return num_array;
}

promptFiveTimes().then((num_array) => {
  resultParagraph.innerText = "";
  for (let i = num_array.length - 1; i >= 0; i--) {
    const resultNum = num_array[i];
    console.log(resultNum);
    resultParagraph.innerText += `Array [${i}] = ${resultNum}\n`;
  }
});
