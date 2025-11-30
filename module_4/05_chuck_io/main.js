(async () => {
  "use strict";
  // Wait for DOM
  await new Promise((resolve) => {
    if (document.readyState !== "loading") resolve();
    else document.addEventListener("DOMContentLoaded", resolve);
  });

  // Html & Head
  const cosmos = new smol.Cosmos({
    name: "Module 4",
    title: "05_chuck_io",
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
  const mainIsland = new smol.Island({ id: "mainIsland" });
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

  /* --- Assignment --- */
  const spark = new smol.Spark({
    baseURL: "https://api.chucknorris.io/jokes/random",
    debug: true,
    useProxy: false,
  });

  const joke = await spark.get();
  if (joke) console.log(joke.value);

  // Start loop (dt)
  cosmos.breathe();
})();
