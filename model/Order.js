const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    sellerId: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    order: {
      productId: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "orders" }
);

module.exports = mongoose.model("Order", userSchema);
