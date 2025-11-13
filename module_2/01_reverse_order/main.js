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

Number.prototype.clamp = function (min, max) {
  return Math.min(Math.max(this, min), max);
};

document.head.appendChild(style);
const resultParagraph = document.createElement("p");
body.appendChild(resultParagraph);
const errorParagraph = document.createElement("p");
body.appendChild(errorParagraph);

function promptNum(promptMsg = "Enter a number:") {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userInput = prompt(promptMsg)?.trim();
      if (userInput === "" || isNaN(userInput) || userInput == null)
        return reject(`Invalid input: ${userInput}. Needs to be a number.`);
      return resolve(Number(userInput));
    }, 50);
  });
}

async function promptFiveTimes() {
  const numArray = Array(5);
  for (let i = 0; i < numArray.length; ) {
    try {
      const num = await promptNum(`Enter ${i + 1}. number`);
      numArray[i] = num;
      resultParagraph.innerText += `Index: ${i} result: ${num}\n`;
      errorParagraph.innerText = "";
      i++;
    } catch (err) {
      errorParagraph.innerText = `Error: ${err}`;
      console.error(err);
    }
  }
  return numArray;
}

function handleResult(numArray) {
  if (numArray == null || numArray.length <= 0)
    throw new Error("Number array cannot be null or empty.");

  const timeoutMS = numArray.length * 100;
  const timeoutStep = timeoutMS / numArray.length;
  resultParagraph.innerText = "";
  for (let i = numArray.length - 1; i >= 0; i--) {
    setTimeout(
      () => {
        const num = numArray[i];
        resultParagraph.innerText += `Array [${i}] = ${num}\n`;
        console.log(num);
      },
      Number(timeoutMS - timeoutStep * i).clamp(0, timeoutMS),
    );
  }
}

promptFiveTimes()
  .then((result) => {
    setTimeout(() => {
      handleResult(result);
    }, 500);
  })
  .catch((err) => {
    errorParagraph.innerText = `${err}`;
    console.error(err);
  });
