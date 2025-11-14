(async () => {
  "use strict";

  // Helpers
  Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
  };

  String.prototype.capitalize = function () {
    return this.split(" ")
      .filter(Boolean)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
      .join(" ");
  };

  function random1To(maxValue) {
    return Math.ceil(Math.random() * maxValue);
  }

  async function createElement(tagName, props = {}, ...children) {
    const element = document.createElement(tagName);
    if (props && typeof props === "object") Object.assign(element, props);

    // RECURSIVE FUNC
    const appendChildElement = async (child) => {
      switch (true) {
        case child == null:
          return;

        case child instanceof Node: // Append nodes directly
          element.appendChild(child);
          return;

        case child && typeof child.then === "function": // Resolve promises then append recursively
          const resolved = await child;
          await appendChildElement(resolved); // RECURSION
          return;

        case Array.isArray(child): // Append each array item recursively
          await Promise.all(child.flat(Infinity).map(appendChildElement)); // RECURSION
          return;

        default: // Handle primitives
          const type = typeof child;
          switch (type) {
            case "string":
            case "number":
              element.appendChild(document.createTextNode(child));
              return;

            case "boolean":
            case "undefined":
              console.warn(`Skipping child of type: ${type}`);
              return;

            default:
              throw new TypeError(
                `Unsupported child type in <${tagName}>: ${JSON.stringify(child)} (type: ${type})`,
              );
          }
      }
    };

    await Promise.all(children.map(appendChildElement));
    return element;
  }

  // Sync operations
  function getRandomName() {
    const CHAR_CODE_A = 97;
    const ALPHABET_LENGTH = 26;
    const MAX_NAME_LENGTH = 12;

    const nameLength = random1To(MAX_NAME_LENGTH);
    let rndName = "";
    for (let i = 0; i < nameLength; i++) {
      const code = CHAR_CODE_A + Math.floor(Math.random() * ALPHABET_LENGTH);
      rndName += String.fromCharCode(code);
    }
    return rndName;
  }

  async function getRandomFullName() {
    const MAX_NAME_PARTS = 3;
    const parts = await Promise.all(
      Array.from({ length: random1To(MAX_NAME_PARTS) }, getRandomName),
    );
    return parts.join(" ").capitalize();
  }

  async function getRandomNames(count) {
    return Promise.all(Array.from({ length: count }, getRandomFullName));
  }

  // Async operations
  async function setupStyles() {
    const styleContent = `
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
          min-width: 400px;
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
    const style = await createElement("style", {}, styleContent.trim());
    document.head.appendChild(style);
  }

  async function createUI() {
    const guestListRoot = await createElement("ol");
    const articleHeading = await createElement("h1", {
      innerText: "<-- Participants -->",
    });
    const guestArticle = await createElement(
      "article",
      {},
      articleHeading,
      guestListRoot,
    );

    document.body.appendChild(guestArticle);

    return { guestListRoot };
  }

  async function renderGuestList(guestList, guestListRoot) {
    for (const name of guestList.slice().sort((a, b) => a.localeCompare(b))) {
      const li = await createElement("li", {}, name);
      guestListRoot.appendChild(li);
    }
  }
  async function getGuestCount() {
    while (true) {
      const trimmedInput = prompt("Enter the number of participants:")?.trim();
      const result = parseInt(trimmedInput, 10);
      if (Number.isInteger(result) && result > 0) {
        return result;
      }
      alert("Enter a positive integer.");
    }
  }

  async function getGuestName(promptStr) {
    let result;
    while (true) {
      result = prompt(promptStr)?.trim();
      if (result) {
        break;
      }
      alert("Name cannot be empty.");
    }
    return result.capitalize();
  }

  async function getGuestList() {
    const guestCount = await getGuestCount();
    const guestList = [];

    // false = prompted names | true = autogenerated names
    const isDebug = true;

    if (isDebug) {
      const guestNames = await getRandomNames(guestCount);
      for (let n of guestNames) {
        guestList.push(n);
      }
    } else {
      for (let i = 0; i < guestCount; i++) {
        const guestName = await getGuestName(
          `Enter the name of participant number (${i + 1}):`,
        );
        guestList.push(guestName);
      }
    }
    return { guestList };
  }

  // Main level
  async function main() {
    try {
      await setupStyles();
      const { guestListRoot } = await createUI();
      const { guestList } = await getGuestList();
      await renderGuestList(guestList, guestListRoot);
    } catch (err) {
      console.error("Error in main:", err);
    }
  }

  main().catch((err) => {
    console.error("Fatal error:", err);
  });
})();
