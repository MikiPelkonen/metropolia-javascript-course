const body = document.body;

const paragraph = document.createElement("p");
body.appendChild(paragraph);

const fetchHelloWorlds = async () => {
  try {
    const data = await fetch("http://localhost:5000/");
    const jsonData = await data.json();
    console.log(jsonData);
    return jsonData;
  } catch (err) {
    console.error(err);
  }
};

fetchHelloWorlds().then((response) => {
  paragraph.innerText = response;
});
