const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const PORT = process.env.PORT || 3001;
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
app.use(cors());
app.use(express.static("build"));
app.use(express.json());
morgan.token("content", function (req, res) {
  const content = req.method === "POST" ? JSON.stringify(req.body) : "";
  return content;
});
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "- ",
      tokens["response-time"](req, res),
      "ms",
      tokens.content(req, res),
    ].join(" ");
  })
);

let phoneBook = [
  {
    name: "Edd Sansome",
    number: "007-111333",
    id: 1,
  },
  {
    name: "Tom Sansome",
    number: "001-123123",
    id: 2,
  },
  {
    name: "Will Sansome",
    number: "069-123321",
    id: 3,
  },
];

const generateId = () => {
  const maxId =
    phoneBook.length > 0 ? Math.max(...phoneBook.map((p) => p.id)) : 0;
  return maxId + 1;
};

app.get("/api/persons", (req, res) => {
  res.json(phoneBook);
});

app.post("/api/persons", (req, res) => {
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  }
  if (phoneBook.find((x) => x.name === req.body.name)) {
    return res.status(400).json({
      error: "name already in phonebook",
    });
  }

  const person = {
    name: req.body.name,
    number: req.body.number,
    date: new Date(),
    id: generateId(),
  };

  phoneBook = phoneBook.concat(person);
  res.json(person);
});

app.get("/", (req, res) => {
  const d = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  res.send(`
  <p>Phonebook has info for ${phoneBook.length} people
  <p>${days[d.getUTCDay()]} ${months[d.getUTCMonth()]} ${d.getUTCDate()}
   ${d.getUTCFullYear()} UTC- ${d.getUTCHours()}:${d.getUTCMinutes()}:${d.getUTCSeconds()} </p>
  
  `);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = phoneBook.find((p) => p.id === id);
  if (!person) {
    return res.status(404).json({
      error: "Person not found!",
    });
  }
  res.send(`
  <h1>${person.name}</h1>
  <h2>${person.number}</h2>
  
  `);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = phoneBook.find((p) => p.id === id);
  if (!person) {
    return res.status(404).json({
      error: "person not found!",
    });
  }
  phoneBook = phoneBook.filter((p) => p.id !== id);
  res.status(204).end();
});
app.use(unknownEndpoint);
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
