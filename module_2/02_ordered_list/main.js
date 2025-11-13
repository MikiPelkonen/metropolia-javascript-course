"use strict";

const body = document.body;
const style = document.createElement("style");
style.textContent = `
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: system-ui;
    }
    article {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 400px;
      height: 400px;
      background-color: rgba(22,22,22,03); 
      border-radius: 0.25rem;
      box-shadow: 1px 3px 6px rgba(22,22,22,0.7);
    }
    h1 {
      color: aquamarine;
    }
    ol {
      display: flex;
      width: 80%;
      flex-direction: column;
    }
    li {
      color: ivory;
      font-size: 1.25rem;
    }
`;
document.head.appendChild(style);

const guestList = document.createElement("article");
const guestListHeader = document.createElement("h1");
guestList.appendChild(guestListHeader);
guestListHeader.innerText = "Guest list:";

body.appendChild(guestList);

const getGuestCount = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let rawInput;
      let result;
      do {
        rawInput = prompt("Enter the number of participants:")?.trim();
        result = Number(rawInput);
      } while (
        rawInput === "" ||
        rawInput === null ||
        !Number.isInteger(result)
      );
      resolve(result);
    }, 50);
  });
};

const getGuestName = (idx) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = prompt(
        `Enter the name of participant number (${idx + 1}):`,
      )?.trim();
      resolve(result);
    }, 50);
  });
};

async function getNames() {
  const guestCount = await getGuestCount();
  const guestList = Array(guestCount).fill("");
  for (let i = 0; i < guestList.length; i++) {
    let guestName;
    do {
      guestName = await getGuestName(i);
      console.log(guestName);
    } while (guestName === "" || guestName === null);
    guestList[i] = guestName;
  }
  return guestList;
}

const orderedList = document.createElement("ol");
guestList.appendChild(orderedList);

getNames().then((guestList) => {
  for (let guest of guestList.sort()) {
    const listItem = document.createElement("li");
    listItem.innerText = guest;
    orderedList.appendChild(listItem);
  }
});
