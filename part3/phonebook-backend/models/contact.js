const mongoose = require('mongoose')
const url = process.env.MONGODB_URI;
if (!url) {
    console.error("MONGODB_URI is missing. Check your .env file.");
    process.exit(1);
  }
  mongoose.set('strictQuery',false)
  mongoose.connect(url)
          .then(() => console.log("connected"))
          .catch((err) => console.error("MongoDB connection error:", err))
  
  const personSchema = new mongoose.Schema(
      {
          id: String,
          name: {
            type: String,
            minLength: 3,
            required: true
          },
          number: String
      }
  )
module.exports = mongoose.model('Contact',personSchema);
  