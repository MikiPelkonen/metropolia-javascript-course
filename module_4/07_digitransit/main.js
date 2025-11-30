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
    title: "07_digi_transit",
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
    className: "transitForm",
    tag: "form",
    text: "Digitransit",
  });

  const query = new smol.Leaf({
    id: "query",
    tag: "input",
    className: "formInput",
  });
  query.el.type = "text";
  query.el.name = "q";
  query.el.placeholder = "Enter start address";

  const submit = new smol.Leaf({ className: "formInput", tag: "input" });
  submit.el.type = "submit";
  submit.el.value = "Calculate route";

  form.addLeaf(query);
  form.addLeaf(submit);
  formContainer.addBranch(form);
  mainContent.addTree(formContainer);

  const statusTree = new smol.Tree({ className: "statusContainer" });
  const statusBranch = new smol.Branch({
    id: "status",
    tag: "ul",
    text: "Route Info",
  });

  const originAddress = new smol.Leaf({ className: "statusItem", tag: "li" });
  const destination = new smol.Leaf({
    className: "statusItem",
    tag: "li",
    text: "To: Metropolia Karamalmi",
  });
  const timeStatus = new smol.Leaf({ className: "statusItem", tag: "li" });

  statusBranch.addLeaf(originAddress);
  statusBranch.addLeaf(destination);
  statusBranch.addLeaf(timeStatus);

  statusTree.addBranch(statusBranch);
  mainContent.addTree(statusTree);

  const metropoliaLocation = {
    latitude: 60.223854244791,
    longitude: 24.758626867439,
  };

  async function geocodeAddress(address) {
    const spark = new smol.Spark({
      baseURL:
        "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates",
      debug: true,
      useProxy: false,
    });
    const queryParams = {
      f: "pjson",
      SingleLine: address,
      maxLocations: 1,
      forStorage: false,
      countryCode: "FI",
      outFields: "Match_addr, Addr_type",
      preferredLabelValues: "matchedCity,matchedStreet",
      returnMatchNarrative: true,
      comprehensizeZoneMatch: true,
    };
    const response = await spark.get(`?${new URLSearchParams(queryParams)}`);
    if (response?.candidates?.length) {
      const coords = response.candidates[0]?.location;
      originAddress.el.textContent = "From: " + response.candidates[0]?.address;
      return { latitude: coords.y, longitude: coords.x };
    }
    throw new Error(`No results for: ${address}`);
  }

  const apiUrl = "https://api.digitransit.fi/routing/v2/finland/gtfs/v1";
  const apiKey = "7a8443959f624ad99d5aa9b19fda4712";

  async function getRouteData(origin, target) {
    const spark = new smol.Spark({
      baseURL: apiUrl,
      headers: {
        "Content-Type": "application/json",
        "digitransit-subscription-key": apiKey,
      },
      debug: true,
      useProxy: false,
    });
    const response = await spark.post(
      "",
      JSON.stringify({
        query: `{
      plan(
        from: {lat: ${origin.latitude}, lon: ${origin.longitude}}
        to: {lat: ${target.latitude}, lon: ${target.longitude}}
        numItineraries: 1
      ) {
        itineraries {
          legs {
            startTime
            endTime
            mode
            duration
            distance
            legGeometry {
              points
            }
          }
        }
      }
    }`,
      }),
    );
    return response;
  }

  const mapTree = new smol.Tree({ id: "map", tag: "div" });
  mainContent.addTree(mapTree);
  const map = L.map("map", {
    center: [metropoliaLocation.latitude, metropoliaLocation.longitude],
    zoom: 15.5,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    boxZoom: true,
    dragging: true,
    tap: true,
    touchZoom: true,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  let currentRouteLayers = [];

  form.el.addEventListener("submit", async (e) => {
    e.preventDefault();
    submit.el.disabled = true;
    submit.el.value = "Calculating route...";

    currentRouteLayers.forEach((layer) => map.removeLayer(layer));
    currentRouteLayers = [];

    try {
      const addressFromInput = query.el.value.trim();
      if (!addressFromInput || addressFromInput == null) {
        console.warn("Please enter an address....");
        throw new Error("Invalid input:", addressFromInput);
      }
      const originCoords = await geocodeAddress(addressFromInput);
      const routeData = await getRouteData(originCoords, metropoliaLocation);
      if (!routeData || !routeData.data.plan.itineraries.length) {
        throw new Error("Failed to get routedata.");
      }

      const googleEncodedRoute = routeData.data.plan.itineraries[0].legs;
      const startTime = googleEncodedRoute[0].startTime;
      const endTime = googleEncodedRoute[googleEncodedRoute.length - 1].endTime;
      timeStatus.el.textContent =
        `Start: ${new Date(startTime).toLocaleString()}` +
        "\n" +
        `End: ${new Date(endTime).toLocaleString()}`;

      for (let i = 0; i < googleEncodedRoute.length; i++) {
        let color = "";
        switch (googleEncodedRoute[i].mode) {
          case "WALK":
            color = "green";
            break;
          case "BUS":
            color = "red";
            break;
          case "RAIL":
            color = "cyan";
            break;
          case "TRAM":
            color = "magenta";
            break;
          default:
            color = "blue";
            break;
        }
        const route = googleEncodedRoute[i].legGeometry.points;
        const pointObjects = L.Polyline.fromEncoded(route).getLatLngs();
        const polyline = L.polyline(pointObjects)
          .setStyle({ color })
          .addTo(map);
        currentRouteLayers.push(polyline);
      }
      map.fitBounds([
        [metropoliaLocation.latitude, metropoliaLocation.longitude],
        [originCoords.latitude, originCoords.longitude],
      ]);
    } catch (err) {
      submit.el.value = "Error...";
      originAddress.el.textContent = err.message;
      console.error(err instanceof Error ? err : new Error("Unknown", err));
    } finally {
      setTimeout(() => {
        submit.el.disabled = false;
        submit.el.value = "Calculate route";
      }, 500);
    }
  });

  // Start loop (dt)
  cosmos.breathe();
})();
