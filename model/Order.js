const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
    pedidoId: {
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
