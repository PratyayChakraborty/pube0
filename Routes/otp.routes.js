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
const { EmailModel } = require("../Model/Email.Model");

// POST /otp/send
router.post("/send", async (req, res) => {
  const { email, otp } = req.body;
  const expiresAt = moment().add(25, "minutes").toDate();
  const domain1 = email.split("@")[1];
  const domain = await EmailModel.findOne({ email: domain1 });
  const x=(domain.discount)
 
  try {
    if (domain) {
      // Save the OTP code and expiration date to the database
      const data = await OtpModel.find({ email: email });
      console.log(data)
      if (data.length == 0) {
        const otp1 = new OtpModel({
          email,
          otp,
          adminDiscount:x,
          expiresAt,
        });
        await otp1.save();
        res.send({
          message: "Email Register",
        });
      } else {
        const pay = { otp: otp, expiresAt };
        await OtpModel.findByIdAndUpdate({ _id: data[0]._id }, pay);
        res.send({
          message: "Email Update",
        });
      }
    } else {
      res.status(401).json({
        message: "Invalid Email Domain",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/verify", async (req, res) => {
  const { email, otpCode } = req.body;
  const domain1 = email.split("@")[1];
  const domain = await EmailModel.findOne({ email: domain1 });
  console.log({ email, otpCode });
  try {
    // Find the OTP code in the database
    const otp = await OtpModel.findOne({
      email: email,
      otp: otpCode,
    });
    if (!otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Delete the OTP code from the database
    // await otp.delete();

    // Generate a JWT token for the user
    const token = jwt.sign(
      { email: otp.email, userId: otp._id,adminDiscount:domain.discount },
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
    res.send({ data: product, email:req.body.email, adminDiscount:req.body.adminDiscount });
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
