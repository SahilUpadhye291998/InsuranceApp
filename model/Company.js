const mongoose = require("mongoose");

let Company = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: false
  },
  securityKey: {
    type: String,
    required: true,
    unique: true
  },
  claims: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  date: {
    type: String,
    default: Date.now
  }
});

module.exports = Company = mongoose.model("Company", User);
