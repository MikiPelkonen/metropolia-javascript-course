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
    title: "06_chuck_form",
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
  world.addOcean(main);
  const mainContent = new smol.Island({ className: "mainContent" });
  main.addIsland(mainContent);

  // Footer
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

  const formContainer = new smol.Tree({ className: "formContainer" });
  const form = new smol.Branch({
    className: "chuckForm",
    tag: "form",
    text: "Chuckolator",
  });

  const query = new smol.Leaf({
    id: "query",
    tag: "input",
    className: "formInput",
  });
  query.el.type = "text";
  query.el.name = "q";
  query.el.placeholder = "Search for chuck norris jokes...";

  const submit = new smol.Leaf({ className: "formInput", tag: "input" });
  submit.el.type = "submit";
  submit.el.value = "Search";

  form.addLeaf(query);
  form.addLeaf(submit);
  formContainer.addBranch(form);
  mainContent.addTree(formContainer);

  form.el.addEventListener("submit", async (e) => {
    e.preventDefault();
    submit.el.disabled = true;

    const oldJokes = document.getElementById("jokeContainer");
    if (oldJokes) oldJokes.remove();

    try {
      const queryParams = query.el.value.trim();
      if (!queryParams || queryParams == null) {
        console.warn("Please enter a query param....");
        throw new Error("Invalid input:", queryParams);
      }
      const spark = new smol.Spark({
        baseURL: "https://api.chucknorris.io/jokes/search",
        debug: true,
        useProxy: false,
      });
      const jokes = await spark.get(
        `?query=${encodeURIComponent(queryParams)}`,
      );
      if (jokes.result) {
        const jokeContainer = new smol.Tree({
          id: "jokeContainer",
          tag: "div",
        });
        const jokeArticle = new smol.Branch({ id: "jokes", tag: "article" });
        for (const joke of jokes.result) {
          jokeArticle.addLeaf(
            new smol.Leaf({ className: "joke", tag: "p", text: joke.value }),
          );
        }
        jokeContainer.addBranch(jokeArticle);
        mainContent.addTree(jokeContainer);
      }
    } catch (err) {
      console.error(err instanceof Error ? err : new Error("unknown", err));
    } finally {
      submit.el.disabled = false;
    }
  });

  // Start loop (dt)
  cosmos.breathe();
})();
