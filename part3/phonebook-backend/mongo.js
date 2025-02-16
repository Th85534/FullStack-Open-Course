const mongoose = require("mongoose")

if(process.argv.length < 3){
    console.log("Give proper pass")
    process.exit(1)
}

const pass = process.argv[2];
const url = `mongodb+srv://dasguptasoumasish:${pass}@phonebook.jaus3.mongodb.net/?retryWrites=true&w=majority&appName=phonebook`

mongoose.set('strictQuery',false)

mongoose.connect(url)
        .then(() => console.log("connected"))
        .catch((err) => console.error("MongoDB connection error:", err))

const personSchema = new mongoose.Schema(
    {
        name: String,
        number: String
    }
)
const Contact = mongoose.model('Contact',personSchema)


if (process.argv.length === 3) {

    Contact.find({})
        .then((result) => {
            console.log("Phonebook:");
            result.forEach((person) => {
                console.log(`${person.name} ${person.number}`);
            });
        })
        .catch((err) => console.error("Error fetching contacts:", err))
        .finally(() => mongoose.connection.close());
} else if (process.argv.length === 5) {

    const person = new Contact({
        name: process.argv[3],
        number: process.argv[4],
    });

    person
        .save()
        .then(() => {
            console.log(`Added ${person.name} (${person.number}) to phonebook`);
        })
        .catch((err) => console.error("Error saving contact:", err))
        .finally(() => mongoose.connection.close());
} else {
    console.log("Invalid arguments. Use:");
    console.log("  To list contacts: node script.js <password>");
    console.log("  To add contact: node script.js <password> <name> <number>");
    mongoose.connection.close();
}