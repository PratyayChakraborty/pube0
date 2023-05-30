// GET all old phones
const express = require("express");
const OldPhonerouter = express.Router();
const { OldphoneModel } = require("../Model/Old.Model");


// GET all old phones
OldPhonerouter.get("/", async (req, res) => {
  try {
    const oldPhones = await OldphoneModel.find();
    res.json(oldPhones);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving old phones" });
  }
});

// GET a specific old phone by ID
OldPhonerouter.get("/old-phones/:id", async (req, res) => {
  try {
    const oldPhone = await OldphoneModel.findById(req.params.id);
    if (!oldPhone) {
      return res.status(404).json({ message: "Old phone not found" });
    }
    res.json(oldPhone);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving old phone" });
  }
});

OldPhonerouter.get("/old/:name", async (req, res) => {
    try {
      const oldPhone = await OldphoneModel.find({modelName:req.params.name});
      if (!oldPhone) {
        return res.status(404).json({ message: "Old phone not found" });
      }
      res.json(oldPhone);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving old phone" });
    }
  });

// POST a new old phone
OldPhonerouter.post("/add", async (req, res) => {
    try {
        const { modelName, returnNoDamage, bodyDamage, screenDamage, minPrice, maxPrice } = req.body;
    
        const oldPhone = new OldphoneModel({
          modelName,
          returnNoDamage,
          bodyDamage,
          screenDamage,
          minPrice,
          maxPrice,
        });
    
        const savedOldPhone = await oldPhone.save();
    
        res.status(201).json(savedOldPhone);
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the old phone entry.' });
      }
});

// PUT/UPDATE an old phone by ID
OldPhonerouter.put("/old-phones/:id", async (req, res) => {
  try {
    const { oldphoneName, model } = req.body;
    const updatedOldPhone = await OldphoneModel.findByIdAndUpdate(
      req.params.id,
      { oldphoneName, model },
      { new: true }
    );
    if (!updatedOldPhone) {
      return res.status(404).json({ message: "Old phone not found" });
    }
    res.json(updatedOldPhone);
  } catch (error) {
    res.status(500).json({ message: "Error updating old phone" });
  }
});

// DELETE an old phone by ID
OldPhonerouter.delete("/old-phones/:id", async (req, res) => {
  try {
    const deletedOldPhone = await OldphoneModel.findByIdAndRemove(
      req.params.id
    );
    if (!deletedOldPhone) {
      return res.status(404).json({ message: "Old phone not found" });
    }
    res.json({ message: "Old phone deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting old phone" });
  }
});

module.exports = { OldPhonerouter };
