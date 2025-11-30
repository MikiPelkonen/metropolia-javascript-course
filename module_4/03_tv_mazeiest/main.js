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
    title: "03_tv_mazeiest",
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

  // Form
  const formTree = new smol.Tree({ className: "formTree" });
  const formBranch = new smol.Branch({ tag: "form" });
  formBranch.el.method = "GET";

  // Form inputs
  const queryInput = new smol.Leaf({ tag: "input" });
  queryInput.el.type = "text";
  queryInput.el.id = "query";
  queryInput.el.name = "q";
  queryInput.el.placeholder = "Search for tv shows...";
  const submitInput = new smol.Leaf({ className: "submitBtn", tag: "input" });
  submitInput.el.type = "submit";
  submitInput.el.value = "Search";

  // Form fetch
  formBranch.el.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitInput.el.disabled = true;
    submitInput.el.value = "Searching...";

    const query = queryInput.el.value.trim();

    if (!query) {
      submitInput.el.disabled = false;
      submitInput.el.value = "Search";
      console.warn("Form input empty.");
      return;
    }
    try {
      const spark = new smol.Spark({
        baseURL: "https://api.tvmaze.com/search/shows",
        debug: true,
        useProxy: false,
      });
      const shows = await spark.get(`?q=${encodeURIComponent(query)}`);
      if (shows) {
        // Delete old results
        const oldResults = document.getElementById("results");
        if (oldResults) oldResults.remove();

        const showTree = new smol.Tree({
          id: "results",
          className: "shows",
        });
        for (const tvShow of shows) {
          const showBranch = new smol.Branch({
            tag: "article",
            className: "show",
          });
          showBranch.addLeaf(
            new smol.Leaf({ tag: "h2", text: tvShow.show.name }),
          );
          showBranch.addLeaf(
            new smol.Leaf(
              { tag: "a", text: tvShow.show.url },
              { target: "_blank" },
            ),
          );
          showBranch.addLeaf(
            new smol.Leaf({
              tag: "img",
              src: tvShow.show.image
                ? tvShow.show.image.medium
                : "https://placehold.co/210x295?text=Not%20Found",
              alt: tvShow.show.name,
              attrs: { width: "210", height: "295" },
            }),
          );
          const summaryLeaf = new smol.Leaf({
            tag: "div",
            className: "summary",
            html: tvShow.show.summary,
          });

          summaryLeaf.scroller = new smol.ScrollController(summaryLeaf.el);
          summaryLeaf.breathe = function (dt) {
            this.scroller.breathe(dt);
          };

          showBranch.addLeaf(summaryLeaf);
          showTree.addBranch(showBranch);
        }
        // Render all
        mainIsland.addTree(showTree);
      }
    } catch (err) {
      console.error(err);
    } finally {
      submitInput.el.disabled = false;
      submitInput.el.value = "Search";
    }
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

  cosmos.breathe();
})();
