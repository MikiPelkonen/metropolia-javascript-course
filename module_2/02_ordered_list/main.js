(async () => {
  "use strict";

  // Helpers
  function appError(msg = "App error", err) {
    return err instanceof Error
      ? new Error(msg, { cause: err })
      : new Error(msg);
  }

  function withTimeout(promise, ms) {
    const timeouPromise = new Promise((_, reject) => {
      setTimeout(() => reject(appError(`Timeout reached ${ms}ms`)), ms);
    });
    return Promise.race([promise, timeouPromise]);
  }

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
    try {
      const element = document.createElement(tagName);
      if (props && typeof props === "object") Object.assign(element, props);
      // RECURSIVE FUNC
      const appendChildElement = async (child) => {
        switch (true) {
          case child == null:
            return;
          // Append nodes directly
          case child instanceof Node:
            element.appendChild(child);
            return;
          // Resolve promises then append recursively
          case child && typeof child.then === "function":
            const resolved = await child;
            appendChildElement(resolved);
            return;
          // Append each array item recursively
          case Array.isArray(child):
            await Promise.all(
              child
                .flat(Infinity)
                .map(
                  async (childPromise) =>
                    await appendChildElement(childPromise),
                ),
            );
            return;
          // Handle primitives
          default:
            const type = typeof child;
            switch (type) {
              case "string":
              case "number":
                element.appendChild(document.createTextNode(child));
                return;
              // Skip possibly null or undefined
              case "boolean":
              case "undefined":
                console.warn(`Skipping child of type: ${type}`);
                return;

              default:
                throw appError(
                  `Unsupported child type in <${tagName}>: ${JSON.stringify(child)} (type: ${type})`,
                );
            }
        }
      };
      await withTimeout(
        await Promise.all(
          children.map(async (child) => await appendChildElement(child)),
        ),
        5000,
      );
      return element;
    } catch (err) {
      throw appError(
        "Failed to append child element",
        err instanceof Error ? err : undefined,
      );
    }
  }

  // Async operations
  async function getRandomName() {
    const CHAR_CODE_A = 97;
    const ALPHABET_LENGTH = 26;
    const MAX_NAME_LENGTH = 12;
    const FALLBACK_NAME = "Fallbacka";

    try {
      const genRandomChar = () => {
        const code = CHAR_CODE_A + Math.floor(Math.random() * ALPHABET_LENGTH);
        return String.fromCharCode(code);
      };
      const nameLength = random1To(MAX_NAME_LENGTH);
      const fakeName = await Promise.all(
        Array.from({ length: nameLength }, () => genRandomChar()),
      );
      return fakeName.join("") || FALLBACK_NAME;
    } catch (err) {
      console.warn(
        appError(
          "Failed to generated random name -> using fallback value",
          err instanceof Error ? err : undefined,
        ),
      );
      return FALLBACK_NAME;
    }
  }

  async function getRandomFullName() {
    const MAX_NAME_PARTS = 3;
    try {
      const parts = await withTimeout(
        await Promise.all(
          Array.from({ length: random1To(MAX_NAME_PARTS) }, () =>
            getRandomName(),
          ),
        ),
        5000,
      );
      return parts.join(" ").capitalize();
    } catch (err) {
      throw appError(
        "Failed to get random full name.",
        err instanceof Error ? err : undefined,
      );
    }
  }

  async function getRandomNames(count) {
    try {
      const names = await Promise.all(
        Array.from({ length: count }, () => getRandomFullName()),
      );
      return names;
    } catch (err) {
      console.warn(
        appError(
          "Fail fetching names -> fallback value",
          err instanceof Error ? err : undefined,
        ),
      );
      return Array(count).fill("Rand Fall Back");
    }
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
    try {
      const style = await createElement("style", {}, styleContent.trim());
      document.head.appendChild(style);
    } catch (err) {
      throw appError(
        "Error setting css styles",
        err instanceof Error ? err : undefined,
      );
    }
  }

  async function createUI() {
    try {
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
    } catch (err) {
      throw appError(
        "Error creating list UI",
        err instanceof Error ? err : undefined,
      );
    }
  }

  async function renderGuestList(guestListRoot, guestList) {
    try {
      for (const name of guestList.slice().sort((a, b) => a.localeCompare(b))) {
        const li = await withTimeout(createElement("li", {}, name), 2000);
        guestListRoot.appendChild(li);
      }
    } catch (err) {
      throw appError(
        `Failed to render guest`,
        err instanceof Error ? err : undefined,
      );
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
      throw appError("Timeout.", err instanceof Error ? err : undefined);
    }
  }

  async function getGuestName(promptStr) {
    try {
      const MAX_ATTEMPTS = 5;
      for (let i = 0; i <= MAX_ATTEMPTS; i++) {
        const result = await withTimeout(
          new Promise((resolve) => resolve(prompt(promptStr)?.trim())),
          10000,
        );
        if (result) return result.capitalize();
        alert("Name cannot be empty.");
      }
    } catch (err) {
      throw appError(
        "Too many attempts or timeout...",
        err instanceof Error ? err : undefined,
      );
    }
  }

  async function getGuestList() {
    try {
      // false = prompt names | true = autogenerate
      const isDebug = true;
      const guestCount = await getGuestCount();

      const guestList = isDebug
        ? await getRandomNames(guestCount)
        : await Promise.all(
            Array.from({ length: guestCount }, (_, i) =>
              getGuestName(`Enter the name of participant number (${i + 1}):`),
            ),
          );

      return { guestList };
    } catch (err) {
      throw appError(
        "Failed to create guest list",
        err instanceof Error ? err : undefined,
      );
    }
  }

  // Main level
  async function main() {
    try {
      const [_, { guestListRoot }, { guestList }] = await Promise.all([
        setupStyles(),
        createUI(),
        getGuestList(),
      ]);
      await renderGuestList(guestListRoot, guestList);
    } catch (err) {
      throw appError("Main level", err instanceof Error ? err : undefined);
    }
  }
  try {
    await main();
  } catch (err) {
    console.error("Fatal", err instanceof Error ? err : "Unknown error");
  }
})();
