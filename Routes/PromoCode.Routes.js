const express = require("express");
const router = express.Router();
const { PromoModel } = require("../Model/Promo.Model");

// GET all promo codes
router.get('/promos', async (req, res) => {
  try {
    // Get all promos from the database
    const promos = await PromoModel.find({});

    // Get the current date
    const currentDate = new Date();

    // Loop through each promo and update status if required
    for (const promo of promos) {
      if (promo.orderDate <= currentDate) {
        // If the orderDate is less than or equal to the current date,
        // update the status to "false"
        await PromoModel.findByIdAndUpdate(promo._id, { $set: { status: "false" } });
        promo.status = "false"; // Update the status in the current data to reflect changes in the response
      }
    }

    // Send the updated promos in the response
    res.json(promos);
  } catch (err) {
    // Handle errors
    res.status(500).json({ error: 'Server Error' });
  }
});

// Add other routes and middleware as needed








// GET a single promo code by ID
router.get("/promocodeoffer/:promoCode1", async (req, res) => {
  try {
    const promoCodes = await PromoModel.find({ promoCode: req.params.promoCode1 });
    res.json(promoCodes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new promo code
router.post("/add", async (req, res) => {
  let payload = req.body;
  try {
    let data1 = new PromoModel(payload);
    console.log(data1);
    let saved = await data1.save();
    res.status(200).json({ msg: "Your Data is Added" });
  } catch (err) {
    res.status(500).json({ message: "Data not Added" });
  }
});


router.get("/:id", async (req, res) => {
  const pageId = req.params.id;

  try {
    const page = await PromoModel.findById(pageId);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.status(200).json(page);
  } catch (err) {
    console.error("Error retrieving page:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT update a promo code
router.put("/:id", getPromoCode, async (req, res) => {
  res.promoCode.promoCode = req.body.promoCode;
  res.promoCode.discount = req.body.discount;

  try {
    const updatedPromoCode = await res.promoCode.save();
    res.json(updatedPromoCode);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a promo code
router.delete("/:id", getPromoCode, async (req, res) => {
  try {
    await res.promoCode.remove();
    res.json({ message: "Promo code deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware function to get a single promo code by ID
async function getPromoCode(req, res, next) {
  let promoCode;
  try {
    promoCode = await PromoModel.findById(req.params.id);
    if (promoCode == null) {
      return res.status(404).json({ message: "Promo code not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.promoCode = promoCode;
  next();
}

module.exports = router;
