require("dotenv").config();
const express = require('express');
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const corsOptions = {
  origin: '*',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
const Contact = require('./models/contact');

app.use(express.json());
app.use(express.static('dist'));
app.use(cors(corsOptions));
app.use(morgan("tiny"));

morgan.token("post-data", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :post-data"));

//get all persons
app.get('/api/persons', (req, res) => {
    Contact.find({})
            .then((result) => {
                return(res.json(result));
            })
            .catch((err) => res.status(500).json({ error: "Error fetching contacts" }))

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
app.post("/api/persons", async (req, res) => {
  const { id, name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "Name and number are required" });
  }

  try {

    const existingPerson = await Contact.findOne({ name });

    if (existingPerson) {
      return res.status(400).json({ error: "Name must be unique" });
    }

    const newPerson = new Contact({ id, name, number });
    const savedPerson = await newPerson.save();
    console.log(savedPerson);
    return res.status(201).json(savedPerson);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
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


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
