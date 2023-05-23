const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  otp: { type: String, required: true },
});

const OtpModel = mongoose.model("email", OtpSchema);

module.exports = OtpModel;
