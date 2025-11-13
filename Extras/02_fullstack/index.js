import express from "express";
import cors from "cors";

const app = express();
const port = 5000;

const corsOptions = { origin: "*" };

app.use(cors(corsOptions));
app.use(express.json());

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

app.get("/", (req, res) => {
  const randomAmount = Math.ceil(Math.random() * 100);
  const helloWorldArray = Array(randomAmount).fill("Hello, world!");
  res.status(200).send(helloWorldArray);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
