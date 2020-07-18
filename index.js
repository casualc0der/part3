require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const PORT = process.env.PORT;
const Contact = require("./models/contact");
const errorHandler = require("./services/errorhandler");
const { json, response } = require("express");

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

app.get("/api/persons", (req, res) => {
  Contact.find({}).then((contacts) => {
    res.json(contacts);
  });
});

app.post("/api/persons", (req, res) => {
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const contact = new Contact({
    name: req.body.name,
    number: req.body.number,
    date: new Date(),
  });
  contact.save().then((savedContact) => {
    res.json(savedContact);
  });
});

app.put("/api/persons/:id", (req, res) => {
  Contact.findById(req.params.id).then((contact) => {
    contact.number = req.body.number;
    contact
      .save()
      .then((savedContact) => {
        res.json(savedContact);
      })
      .catch((error) => next(error));
  });
});

app.get("/", (req, res) => {
  res.json({ message: "This is the hompage(for heroku)!" });
});

app.get("/info", (req, res) => {
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

  Contact.find({}).then((contacts) => {
    res.send(`
  <p>Phonebook has info for ${contacts.length} people
  <p>${days[d.getUTCDay()]} ${months[d.getUTCMonth()]} ${d.getUTCDate()}
   ${d.getUTCFullYear()} UTC- ${d.getUTCHours()}:${d.getUTCMinutes()}:${d.getUTCSeconds()} </p>
  
  `);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res) => {
  Contact.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));

  // const id = Number(req.params.id);
  // const person = phoneBook.find((p) => p.id === id);
  // if (!person) {
  //   return res.status(404).json({
  //     error: "person not found!",
  //   });
  // }
  // phoneBook = phoneBook.filter((p) => p.id !== id);
  // res.status(204).end();
});

app.use(unknownEndpoint);
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
app.use(errorHandler);
