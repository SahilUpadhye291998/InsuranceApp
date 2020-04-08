const mongoose = require("mongoose");

let User = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  securityKey: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    require: true,
  },
  claims: [
    {
      claimDesc: String,
      claimImagePath: String,
      claimDate: Date,
      claimAmount: {
        type: Number,
        require: false,
      },
    },
  ],
  date: {
    type: String,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("User", User);
