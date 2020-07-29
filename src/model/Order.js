const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
    orderId: {
      type: Number,
      required: true,
    },
    skus: [
      {
        skuCode: {
          type: "String",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        size: {
          type: "String",
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: new Date(),
    },
    status: {
      type: String,
      default: "Pendente",
    },
  },
  { collection: "orders" }
);

module.exports = mongoose.model("Order", orderSchema);
