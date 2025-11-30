"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Html & Head
  const cosmos = new smol.Cosmos({
    name: "Module 4",
    title: "02_tv_mazeier",
    debug: false,
  });
  // Body
  const world = new smol.World({ id: "app" });
  cosmos.bigBang(world);

  // Header
  const header = new smol.Ocean({ className: "header", tag: "header" });
  const headerIsland = new smol.Island();
  const titleTree = new smol.Tree();
  const headingBranch = new smol.Branch();
  headingBranch.addLeaf(new smol.Leaf({ tag: "h1", text: cosmos.name }));
  headingBranch.addLeaf(new smol.Leaf({ tag: "p", text: cosmos.title }));
  titleTree.addBranch(headingBranch);
  headerIsland.addTree(titleTree);
  header.addIsland(headerIsland);
  world.addOcean(header);

  // Main
  const main = new smol.Ocean({ className: "main", tag: "main" });
  const mainIsland = new smol.Island();

  // Form
  const formTree = new smol.Tree({ className: "formTree" });
  const formBranch = new smol.Branch({ tag: "form" });
  formBranch.el.action = "https://api.tvmaze.com/search/shows";
  formBranch.el.method = "GET";
  // Form inputs
  const queryInput = new smol.Leaf({ tag: "input" });
  queryInput.el.type = "text";
  queryInput.el.id = "query";
  queryInput.el.name = "q";
  queryInput.el.placeholder = "Search for tv shows...";
  const submitInput = new smol.Leaf({ tag: "input" });
  submitInput.el.type = "submit";
  submitInput.el.value = "Search";

  // Form fetch
  formBranch.el.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitInput.el.disabled = true;
    submitInput.el.value = "Searching...";
    const spark = new smol.Spark({
      baseURL: "https://api.tvmaze.com/search/shows",
      debug: true,
      useProxy: true,
    });
    const query = queryInput.el.value.trim();
    if (query) {
      const response = await spark.get(`?q=${encodeURIComponent(query)}`);
      console.log(response);
    }
    setTimeout(() => {
      submitInput.el.disabled = false;
      submitInput.el.value = "Search";
    }, 500);
  });

  formBranch.addLeaf(queryInput);
  formBranch.addLeaf(submitInput);
  formTree.addBranch(formBranch);
  mainIsland.addTree(formTree);
  main.addIsland(mainIsland);
  world.addOcean(main);

  // FOOTER
  const footer = new smol.Ocean({ className: "footer", tag: "footer" });
  const footerIsland = new smol.Island();
  const footerTree = new smol.Tree();
  const footerBranch = new smol.Branch();
  footerBranch.addLeaf(
    new smol.Leaf({ tag: "h2", text: "Metropolia TXK25S1-D" }),
  );
  footerBranch.addLeaf(
    new smol.Leaf({ tag: "p", text: "- smol team, big dreams -" }),
  );
  footerTree.addBranch(footerBranch);
  footerIsland.addTree(footerTree);
  footer.addIsland(footerIsland);
  world.addOcean(footer);
});
