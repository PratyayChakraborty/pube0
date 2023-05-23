const express = require("express");
const router = express.Router();
const otpGenerator = require("otp-generator");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const OtpModel = require("../Model/otp.model");
const authMiddleware = require("../middleware/auth.middleware");
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// POST /otp/send
router.post("/send", async (req, res) => {
  const {  email, otp } = req.body;
  const expiresAt = moment().add(5, "minutes").toDate();

  try {
    // Save the OTP code and expiration date to the database
    const data = await OtpModel.find({ email: email });
    if (data.length==0) {
      const otp1 = new OtpModel({
        email,
        otp,
        expiresAt,
      });
      await otp1.save();
      res.send({
        message: "Email Register" 
      });
    } else {
    
      const pay = { otp: otp, expiresAt };
       await OtpModel.findByIdAndUpdate({ _id: data[0]._id }, pay);
      
       res.send({
        message: "Email Update" 
      });
    }   
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/verify", async (req, res) => {
  const { email, otpCode } = req.body;
  console.log({ email, otpCode });
  try {
    // Find the OTP code in the database
    const otp = await OtpModel.findOne({
      email: email,
      otp: otpCode,
    });
    console.log(otp);
    if (!otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Delete the OTP code from the database
    // await otp.delete();

    // Generate a JWT token for the user
    const token = jwt.sign(
      { phoneNumber: otp.phoneNumber, userId: otp._id },
      process.env.JWT_SECRET
    );

    res.json({ message: "OTP verified successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/", authMiddleware, async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const product = await OtpModel.find({ _id: decoded.userId });
    res.send({ data: product });
  } catch (error) {
    res.status(500).send({
      error: true,
      msg: "something went wrong",
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const product = await OtpModel.find({ _id: decoded.userId });
    res.send({ data: product });
  } catch (error) {
    res.status(500).send({
      error: true,
      msg: "something went wrong",
    });
  }
});

module.exports = router;
