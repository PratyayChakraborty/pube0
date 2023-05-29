const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    Mobile: { type: Number,required: true },
    pincode: { type: Number,required: true },
    locality: { type: String },
    address: { type: String,required: true },
    city: { type: String,required: true },
    state: { type: String,required: true },
    landmark: { type: String },
    alternatephone: { type: Number,required: true },
    addresstype:{ type: String },
    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Delivered"],
      default: "Pending",
    },
    shippingAddress: { type: String, required: true },
    totalprice: { type: Number, required: true },
    oldmobileModel:{ type: String},
    mobileCondition:{ type: String},
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        title: { type: String, required: true },
        image: { type: String, required: true },
        singleItemPrice: { type: Number, required: true },
        totalitemPrice: { type: Number, required: true },
        display: { type: String, required: true },
        storage: { type: String, required: true },
        quantity: { type: Number, required: true },
        colour: { type: String, required: true },
        status: {
          type: String,
          enum: ["Pending", "Confirmed", "Delivered"],
          default: "Pending",
        },
      },
    ],
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
      required: true,
    },
    promoCode: { type: String },
    promoDiscount: { type: String },
    discountedTotalprice:{ type: Number,required: true, },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    orderDate: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const OrderModel = mongoose.model("order", orderSchema);

module.exports = {
  OrderModel,
};
