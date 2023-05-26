const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    username: { type: String },
    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Delivered"],
      default: "Pending",
    },
    shippingAddress: { type: String, required: true },
    totalprice: { type: Number, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true },
    storage: { type: String, required: true },
    display: { type: String, required: true },
    ExchangePhone: { type: String },
    phoneCondition: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Delivered"],
      default: "Pending",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    orderDate: { type: Date, default: Date.now },
  }
);

const OrderModel = mongoose.model("order", orderSchema);

module.exports = {
  OrderModel,
};
