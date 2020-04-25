const mongoose = require("mongoose");

let User = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
    unique: true,
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
  paidAmount: {
    type: Number,
    require: false,
    default: 0,
  },
  companyID: {
    type: String,
    require: true,
  },
  claims: [
    {
      claimDesc: String,
      claimImagePath: String,
      claimDate: Date,
      claimAmount: Number,
    },
  ],
  date: {
    type: String,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("User", User);
