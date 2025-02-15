const express = require('express');
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(express.json());
app.use(express.static('dist'));
app.use(cors());
app.use(morgan("tiny"));

morgan.token("post-data", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :post-data"));

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

//home of server
app.get("/", (req, res) => {
    res.send("Welcome to the Phonebook API! Visit /api/persons to see the data.");
});

//get all persons
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

//get info of server
app.get("/info", (req, res) => {
    const numEntries = persons.length;
    const currentTime = new Date().toString();
  
    res.send(`
      <p>Phonebook has info for ${numEntries} people</p>
      <p>${currentTime}</p>
    `);
});

//get a single person
app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = persons.find((p) => p.id === id);
  
    if (person) {
      res.json(person);
    } else {
      res.status(404).json({ error: "Person not found" });
    }
});

//adding new person
app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "Both name and number are required" });
  }

  const nameExists = persons.some((p) => p.name === name);
  if (nameExists) {
    return res.status(400).json({ error: "Name must be unique" });
  }

  const id = Math.floor(Math.random() * 10000) + 1;

  const newPerson = { id, name, number };
  persons.push(newPerson);

  res.status(201).json(newPerson);
});

//delete a person's data
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);

  if (!person) {
    return res.status(404).json({ error: "Person not found" });
  }

  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
