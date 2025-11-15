(async () => {
  "use strict";

  function appError(msg, err) {
    return err instanceof Error
      ? new Error(msg, { cause: err })
      : new Error(msg);
  }

  function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(appError("Timeout", _)), ms),
      ),
    ]);
  }

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
          await Promise.all(
            child
              .flat(Infinity)
              .map((childPromise) =>
                withTimeout(appendChildElement(childPromise), 3000),
              ),
          ); // RECURSION
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
              throw appError(
                `Failed to add child element: ${JSON.stringify(child)}`,
                new TypeError(
                  `Unsupported child type in <${tagName}>: ${JSON.stringify(child)} (type: ${type})`,
                ),
              );
          }
      }
    };

    await Promise.all(
      children.map((child) => withTimeout(appendChildElement(child), 3000)),
    );
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

  // Async operations
  async function getRandomFullName() {
    const MAX_NAME_PARTS = 3;
    const parts = await Promise.all(
      Array.from(
        { length: random1To(MAX_NAME_PARTS) },
        async () => await withTimeout(getRandomName(), 2000),
      ),
    );
    return parts.join(" ").capitalize();
  }

  async function getRandomNames(count) {
    const names = await Promise.all(
      Array.from({ length: count }, async () => {
        try {
          return await withTimeout(getRandomFullName(), 2000);
        } catch {
          return "rndname"; // fallback
        }
      }),
    );
    return names;
  }

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
      try {
        const li = await withTimeout(createElement("li", {}, name), 2000);
        guestListRoot.appendChild(li);
      } catch (err) {
        throw appError(`Failed to render guest: ${name}.`, err);
      }
    }
  }
  async function getGuestCount() {
    try {
      const input = await withTimeout(
        new Promise((resolve) =>
          resolve(prompt("Enter the number of participants:")?.trim()),
        ),
        30000,
      );
      const result = parseInt(input, 10);
      if (Number.isInteger(result) && result > 0) return result;
      alert("Invalid input. Enter a positive integer.");
    } catch (err) {
      throw appError("Timeout.", err);
    }
  }

  async function getGuestName(promptStr) {
    const MAX_ATTEMPTS = 5;
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      try {
        const result = await withTimeout(
          new Promise((resolve) => resolve(prompt(promptStr)?.trim())),
          30000,
        );
        if (result) return result.capitalize();
        alert("Name cannot be empty.");
      } catch (err) {
        throw appError("Too many attempts or timeout.", err);
      }
    }
  }

  async function getGuestList() {
    const guestCount = await getGuestCount();

    // false = prompted names | true = autogenerated names
    const isDebug = true;

    if (isDebug) {
      const guestList = await getRandomNames(guestCount);
      return { guestList };
    }

    const guestList = await Promise.all(
      Array.from({ length: guestCount }, (_, i) =>
        withTimeout(
          getGuestName(`Enter the name of participant number (${i + 1}):`),
          2000,
        ),
      ),
    );

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
      throw err;
    }
  }

  main().catch((err) => {
    console.error("Fatal", err);
  });
})();
