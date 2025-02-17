const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v) && v.length >= 8;
      },
      message: (props) => `${props.value} is not a valid phone number! Format should be XX-XXXXXXX or XXX-XXXXXXXX`,
    },
  },
});

module.exports = mongoose.model("Contact", contactSchema);
