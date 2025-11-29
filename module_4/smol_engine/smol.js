window.smol = window.smol || {};

(function (global) {
  // ----- Message prefixes -----
  const MSG = Object.freeze({
    engine: "[smol_w0rld]",
    cosmos: "[cosmos]",
    world: "[world]",
    ocean: "[ocean]",
    island: "[island]",
    forest: "[forest]",
    tree: "[tree]",
    branch: "[branch]",
    leaf: "[leaf]",
    spark: "[spark]",
    sparkGET: "[spark GET]",
    sparkPOST: "[spark POST]",
  });

  global.smol.MSG = MSG;

  // ----- Cosmos -----
  // Html & Head
  function Cosmos({
    name = "smol <(^^,)>",
    title = "smol_w0rld",
    debug = false,
  } = {}) {
    this.name = name;
    this.title = title;
    this.world = null;
    document.title = this.title;
    if (debug) document.body.classList.add("debug");
  }

  Cosmos.prototype.bigBang = function (world) {
    this.world = world;
    if (world.el) document.body.appendChild(world.el);
  };

  Cosmos.prototype.breathe = function () {
    let lastTime = performance.now();

    const lifeCycle = (now) => {
      const dt = now - lastTime;
      lastTime = now;
      if (this.world && this.world.breathe) this.world.breathe(dt);
      requestAnimationFrame(lifeCycle);
    };

    requestAnimationFrame(lifeCycle);
  };

  global.smol.Cosmos = Cosmos;

  // ----- w0rld -----
  // Body
  function World({ id = "", className = "", tag = "div" } = {}) {
    this.name = "world";
    this.el = document.createElement(tag);
    this.el.classList.add(this.name);
    this.oceans = [];

    if (id) this.el.id = id;
    if (className) this.el.classList.add(className);
  }

  World.prototype.addOcean = function (ocean) {
    this.oceans.push(ocean);
    this.el.appendChild(ocean.el);
  };

  World.prototype.breathe = function (dt) {
    this.oceans.forEach((o) => o.breathe(dt));
  };

  global.smol.World = World;

  // ----- Ocean -----
  // Header, Main, Footer, Sides
  function Ocean({ id = "", className = "", tag = "div" } = {}) {
    this.name = "ocean";
    this.el = document.createElement(tag);
    this.el.classList.add(this.name);
    this.islands = [];

    if (id) this.el.id = id;
    if (className) this.el.classList.add(className);
  }

  Ocean.prototype.addIsland = function (island) {
    this.islands.push(island);
    this.el.appendChild(island.el);
  };

  Ocean.prototype.breathe = function (dt) {
    this.islands.forEach((i) => i.breathe(dt));
  };

  global.smol.Ocean = Ocean;

  // ----- Island -----
  // Section, Article
  function Island({ id = "", className = "", tag = "section" } = {}) {
    this.name = "island";
    this.el = document.createElement(tag);
    this.el.classList.add(this.name);
    this.forests = [];
    this.trees = [];

    if (id) this.el.id = id;
    if (className) this.el.classList.add(className);
  }
  Island.prototype.addForest = function (forest) {
    this.forests.push(forest);
    this.el.appendChild(forest.el);
  };

  Island.prototype.addTree = function (tree) {
    this.trees.push(tree);
    this.el.appendChild(tree.el);
  };

  Island.prototype.breathe = function (dt) {
    this.forests.forEach((f) => f.breathe(dt));
    this.trees.forEach((t) => t.breathe(dt));
  };

  global.smol.Island = Island;

  // ----- Forest -----
  // Div, Nav etc...todo.
  function Forest({ id = "", className = "", tag = "div" } = {}) {
    this.name = "forest";
    this.el = document.createElement(tag);
    this.el.classList.add(this.name);
    this.trees = [];

    if (id) this.el.id = id;
    if (className) this.el.classList.add(className);
  }

  Forest.prototype.addTree = function (tree) {
    this.trees.push(tree);
    this.el.appendChild(tree.el);
  };

  Forest.prototype.breathe = function (dt) {
    this.trees.forEach((t) => t.breathe(dt));
  };

  global.smol.Forest = Forest;

  // ----- Tree -----
  // Div, Lists, Grids, etc..
  function Tree({ id = "", className = "", tag = "div", text = "" } = {}) {
    this.name = "tree";
    this.el = document.createElement(tag);
    this.el.classList.add(this.name);
    this.branches = [];

    if (id) this.el.id = id;
    if (className) this.el.classList.add(className);
    if (text) this.el.textContent = text;
  }

  Tree.prototype.addBranch = function (branch) {
    this.branches.push(branch);
    this.el.appendChild(branch.el);
  };

  Tree.prototype.breathe = function (dt) {
    this.branches.forEach((b) => b.breathe?.(dt));
  };

  global.smol.Tree = Tree;

  // ----- Branch -----
  // Div, List Items, GridRows, etc...
  function Branch({ id = "", className = "", tag = "div", text = "" } = {}) {
    this.name = "branch";
    this.el = document.createElement(tag);
    this.el.classList.add(this.name);
    this.leaves = [];

    if (id) this.el.id = id;
    if (className) this.el.classList.add(className);
    if (text) this.el.textContent = text;
  }

  Branch.prototype.addLeaf = function (leaf) {
    this.leaves.push(leaf);
    this.el.appendChild(leaf.el);
  };

  Branch.prototype.breathe = function (dt) {
    this.leaves.forEach((l) => l.breathe?.(dt));
  };

  global.smol.Branch = Branch;

  // ----- Leaf -----
  // "BlurHash" fake placeholder
  const BLURRED_SQUARE_SRC = Object.freeze(
    "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3cdefs%3e%3cfilter id='b' color-interpolation-filters='sRGB'%3e%3cfeGaussianBlur stdDeviation='10'/%3e%3c/filter%3e%3c/defs%3e%3crect width='100' height='100' fill='%23ccc' filter='url(%23b)'/%3e%3c/svg%3e",
  );
  global.smol.BLURRED_SQUARE_SRC = BLURRED_SQUARE_SRC;
  // NotFound placeholder
  const NOT_FOUND_SRC = Object.freeze(
    "https://placehold.co/210x295?text=Not%20Found",
  );
  global.smol.NOT_FOUND_SRC = NOT_FOUND_SRC;
  // Default timeouts
  const TIMEOUTS = Object.freeze({
    IMG: 4000,
    REQUEST: 5000,
    GET: 10000,
    POST: 5000,
    RETRIES: 3,
    DELAY: 500,
  });
  global.smol.TIMEOUTS = TIMEOUTS;

  // Div, Anchors, Ps, Hs, GridColumns, etc.
  function Leaf({
    id = "",
    className = "",
    tag = "div",
    text = "",
    html = "",
    src = "",
    alt = "",
    attrs = {},
  } = {}) {
    this.name = "leaf";
    this.el = document.createElement(tag);
    this.el.classList.add(this.name);

    if (id) this.el.id = id;
    if (className) this.el.classList.add(className);
    if (tag === "img" && src) {
      if (alt) this.el.alt = alt;

      this.el.src = smol.BLURRED_SQUARE_SRC;
      this.el.classList.add("loading");
      const remoteSrc = src;

      const loader = new Image();
      let timerId;

      loader.onload = () => {
        clearTimeout(timerId);
        this.el.src = remoteSrc;
        this.el.classList.remove("loading");
        this.el.classList.add("loaded");
      };

      const handleNotFound = () => {
        clearTimeout(timerId);
        this.el.src = smol.NOT_FOUND_SRC;
        this.el.classList.remove("loading");
      };

      loader.onerror = handleNotFound;
      timerId = setTimeout(handleNotFound, smol.TIMEOUTS.IMG);

      loader.src = remoteSrc;
    }
    if (html) {
      this.el.innerHTML = html;
    } else if (text) this.el.textContent = text;

    for (const [key, value] of Object.entries(attrs)) {
      this.el.setAttribute(key, value);
    }
  }

  Leaf.prototype.breathe = function (dt) {};

  global.smol.Leaf = Leaf;

  // ----- Spark -----
  const DEFAULT_HEADERS = Object.freeze({
    Accept: "application/json",
  });

  global.smol.DEFAULT_HEADERS = DEFAULT_HEADERS;

  // Fetch API wrapper
  function Spark({
    baseURL = "",
    headers = {},
    debug = false,
    useProxy = false,
  } = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = headers;
    this.debug = debug;
    this.useProxy = useProxy;
  }

  // Header helper
  Spark.prototype._buildHeaders = function (extra = {}) {
    return {
      ...smol.DEFAULT_HEADERS,
      ...this.defaultHeaders,
      ...extra,
    };
  };

  // URL helper
  Spark.prototype._buildURL = function (path = "") {
    const url = this.baseURL + path;
    if (this.useProxy) {
      /* Pass CORS with proxy when serving from file:// */
      const proxyUrl = `https://users.metropolia.fi/~ilkkamtk/proxy.php?url=${encodeURIComponent(url)}`;
      if (this.debug) console.log(smol.MSG.spark, proxyUrl);
      return proxyUrl;
    }
    return url;
  };

  // Request helper
  Spark.prototype._request = async function (
    method,
    path = "",
    body = null,
    options = {},
    timeout = smol.TIMEOUTS.REQUEST,
    retries = smol.TIMEOUTS.RETRIES,
    delay = smol.TIMEOUTS.DELAY,
  ) {
    for (let attempt = 0; attempt < retries; attempt++) {
      const abortController = new AbortController();
      const id = setTimeout(() => abortController.abort(), timeout);

      try {
        const url = this._buildURL(path);
        const headers = this._buildHeaders(options.headers);

        const fetchOptions = {
          method,
          headers,
          ...(body && { body: JSON.stringify(body) }),
          signal: abortController.signal,
        };

        if (this.debug)
          console.log(
            method === "GET" ? smol.MSG.sparkGET : smol.MSG.sparkPOST,
            fetchOptions,
          );

        const response = await fetch(url, fetchOptions);
        if (!response.ok)
          throw new Error(`${response.status} ${response.statusText}`);

        let data = await response.json();
        //if (this.useProxy) data = JSON.parse(data.contents);
        // no need with metropolia proxy...
        return data;
      } catch (err) {
        if (attempt < retries - 1) {
          if (this.debug)
            console.warn(
              `Attempt ${attempt + 1} failed, retrying in ${delay}ms...`,
              err,
            );
          await new Promise((res) => setTimeout(res, delay));
          delay *= 2;
        } else {
          throw err instanceof Error ? err : new Error("unknown");
        }
      } finally {
        clearTimeout(id);
      }
    }
  };

  // GET
  Spark.prototype.get = async function (
    path = "",
    options = {},
    timeout = smol.TIMEOUTS.GET,
    retries = smol.TIMEOUTS.RETRIES,
    delay = smol.TIMEOUTS.DELAY,
  ) {
    return this._request("GET", path, null, options, timeout, retries, delay);
  };

  // POST
  Spark.prototype.post = async function (
    path = "",
    body = {},
    options = {},
    timeout = smol.TIMEOUTS.POST,
    retries = smol.TIMEOUTS.RETRIES,
    delay = smol.TIMEOUTS.DELAY,
  ) {
    return this._request("POST", path, body, options, timeout, retries, delay);
  };

  global.smol.Spark = Spark;

  global.smol.ScrollController = class {
    constructor(el) {
      this.el = el;
      this.direction = 0; // -1 = scroll up, 0 = stop, 1 = scroll down
      this.speedDown = 180; // px/s
      this.speedUp = 340; // px/s
      this.resetOnTop = true;

      el.addEventListener("mouseenter", () => {
        this.direction = 1;
      });

      el.addEventListener("mouseleave", () => {
        this.direction = -1;
      });
    }

    breathe(dt) {
      const px = dt / 2000;

      if (this.direction === 1) {
        this.el.scrollTop += this.speedDown * px;
      } else if (this.direction === -1) {
        this.el.scrollTop -= this.speedUp * px;
        if (this.resetOnTop && this.el.scrollTop <= 0) {
          this.el.scrollTop = 0;
          this.direction = 0; // stop resetting
        }
      }
    }
  };
})(window);
