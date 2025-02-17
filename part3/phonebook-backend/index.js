require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/contact");

const app = express();

// Middleware Setup
app.use(express.json());
app.use(express.static("dist"));
app.use(cors({ origin: "*", methods: "GET,HEAD,PUT,PATCH,POST,DELETE", credentials: true }));
app.use(morgan("tiny"));

morgan.token("post-data", (req) => (req.method === "POST" ? JSON.stringify(req.body) : ""));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :post-data"));

// Get All Persons
app.get("/api/persons", async (req, res, next) => {
  try {
    const persons = await Contact.find({});
    res.json(persons);
  } catch (error) {
    next(error);
  }
});

// Get Info of Server
app.get("/info", async (req, res, next) => {
  try {
    const numEntries = await Contact.countDocuments({});
    const currentTime = new Date().toString();
    res.send(`
      <p>Phonebook has info for ${numEntries} people</p>
      <p>${currentTime}</p>
    `);
  } catch (error) {
    next(error);
  }
});

// Get a Single Person
app.get("/api/persons/:id", async (req, res, next) => {
  try {
    const person = await Contact.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.json(person);
  } catch (error) {
    next(error);
  }
});

// Add a New Person
app.post("/api/persons", async (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "Name and number are required" });
  }

  try {
    const existingPerson = await Contact.findOne({ name });
    if (existingPerson) {
      return res.status(400).json({ error: "Name must be unique" });
    }

    const newPerson = new Contact({ name, number });
    const savedPerson = await newPerson.save();
    res.status(201).json(savedPerson);
  } catch (error) {
    next(error);
  }
});

app.put("/api/persons/:id", async (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "Name and number are required" });
  }

  try {
    const updatedPerson = await Contact.findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true, context: "query" } // Returns updated doc & applies validation
    );

    if (!updatedPerson) {
      return res.status(404).json({ error: "Person not found" });
    }

    res.json(updatedPerson);
  } catch (error) {
    next(error);
  }
});

// Delete a Person
app.delete("/api/persons/:id", async (req, res, next) => {
  try {
    const person = await Contact.findByIdAndDelete(req.params.id);
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Error Handling Middleware
const errorHandler = (error, req, res ) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  res.status(500).json({ error: "Internal server error" });
};

app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
