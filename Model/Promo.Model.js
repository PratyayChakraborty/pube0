const mongoose = require("mongoose");

const PromoSchema = new mongoose.Schema(
  {
    promoCode: { type: String, required: true },
    discount: { type: Number, required: true },
    status: { type: String, required: true, default: "true" },
    orderDate: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Middleware to update status when the order date is reached
const updateStatus = function () {
  const currentDate = new Date();
  if (this.orderDate <= currentDate) {
    this.status = "false";
  }
};

// Pre-save middleware
PromoSchema.pre("save", function (next) {
  updateStatus.call(this);
  next();
});

// Pre-update middleware
PromoSchema.pre("findOneAndUpdate", function (next) {
  updateStatus.call(this._update.$set);
  next();
});

const PromoModel = mongoose.model("Promo", PromoSchema);

module.exports = {
  PromoModel,
};
