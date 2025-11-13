(async () => {
  "use strict";

  async function getGuestCount() {
    while (true) {
      const trimmedInput = prompt("Enter the number of participants:")?.trim();
      const result = Number(trimmedInput);
      if (Number.isInteger(result) && result > 0) {
        return result;
      }
      alert("Enter a positive integer.");
    }
  }

  async function getGuestName(idx) {
    let result;
    while (true) {
      result = prompt(
        `Enter the name of participant number (${idx + 1}):`,
      )?.trim();
      if (result) {
        break;
      }
      alert("Name cannot be empty.");
    }
    const formattedResult = result
      .split(" ")
      .filter(Boolean)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
      .join(" ");

    return formattedResult;
  }

  async function getGuestList() {
    const guestCount = await getGuestCount();
    const guestList = Array(guestCount);
    for (let i = 0; i < guestList.length; i++) {
      const guestName = await getGuestName(i);
      guestList[i] = guestName;
    }
    return guestList;
  }

  async function renderGuestList(guestList, guestListRoot) {
    const sortedList = guestList.slice().sort((a, b) => a.localeCompare(b));
    for (const guest of sortedList) {
      const li = document.createElement("li");
      li.textContent = guest;
      guestListRoot.appendChild(li);
    }
  }

  async function main() {
    try {
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
          padding: 1.5rem;
          width: 400px;
          height: auto;
          background: linear-gradient(135deg, rgba(22,22,22,0.7), rgba(44,44,44,0.7));
          border: 3px groove silver;
          border-radius: 0.25rem;
          box-shadow: 1px 3px 6px rgba(22,22,22,0.7);
          text-shadow: 0 1px 1px rgba(22,22,22,0.7);
        }
        h1 {
          color: aquamarine;
        }
        ol {
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        li {
          color: ivory;
          font-size: 1.25rem;
          list-style-type: none;
          opacity: 0;
          animation: fadeIn 2s forwards;
        }
        li::before {
          content: "<[~";
          padding-right: 0.25rem;
          color: aquamarine;
        }
        li::after {
          content: "~]>";
          padding-left: 0.25rem;
          color: aquamarine;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
    `;
      document.head.appendChild(style);

      const guestArticle = document.createElement("article");
      const guestListHeader = document.createElement("h1");
      guestListHeader.innerText = "--- Guest list ---";
      guestArticle.appendChild(guestListHeader);

      const docFragment = document.createDocumentFragment();
      const guestListRoot = document.createElement("ol");
      docFragment.appendChild(guestListRoot);

      document.body.appendChild(guestArticle);

      const guestList = await getGuestList();
      await renderGuestList(guestList, guestListRoot);

      guestArticle.appendChild(docFragment);
    } catch (err) {
      console.error("Error in main:", err);
    }
  }
  try {
    await main();
  } catch (err) {
    console.error("Fatal error:", err);
  }
})();
