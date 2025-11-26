"use strict";
// Site elements
const headerElements = {
  tag: "header",
  children: [
    { tag: "h1", text: "Module 4" },
    { tag: "hr" },
    { tag: "p", text: "--- 01_tv_maze ---" },
  ],
};
const mainElements = {
  tag: "main",
  children: [
    {
      id: "tv-form",
      tag: "form",
      action: "https://api.tvmaze.com/search/shows",
      children: [
        { id: "query", name: "q", type: "text", tag: "input" },
        { id: "submit", value: "Search", tag: "input" },
      ],
    },
  ],
};
const footerElements = {
  tag: "footer",
  children: [
    { tag: "h2", text: "Copyright (c) 2025 App. All Rights Reserved." },
    { tag: "hr" },
  ],
};

function createElementByTag(tag) {
  return document.createElement(tag);
}

function createLayout() {
  const header = createElementByTag(headerElements.tag);
  header.id = "app-header";
  document.body.appendChild(header);
  headerElements.children.forEach((c) => {
    const child = createElementByTag(c.tag);
    child.innerText = c.text ? c.text : "";
    header.appendChild(child);
  });

  const appendChildren = (c) => {
    const child = createElementByTag(c.tag);
    child.innerText = c.text ? c.text : "";
    return child;
  };

  const main = createElementByTag(mainElements.tag);
  main.id = "app-main";
  document.body.append(main);
  mainElements.children.forEach((c) => {
    const child = createElementByTag(c.tag);
    child.innerText = c.text ? c.text : "";
    main.append(child);
    if (c.children) {
      c.children.forEach((ic) => {
        const innerChild = createElementByTag(ic.tag);
        child.innerText = ic.text ? ic.text : "";
        child.appendChild(innerChild);
      });
    }
  });
  const footer = createElementByTag(footerElements.tag);
  footer.id = "app-footer";
  document.body.append(footer);
  footerElements.children.forEach((c) => {
    const child = createElementByTag(c.tag);
    child.innerText = c.text ? c.text : "";
    footer.appendChild(child);
  });
}

createLayout();
