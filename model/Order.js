const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    sellerId: {
      type: String,
      required: true,
    },
    pedidoId: {
      type: String,
      required: true,
    },
    products: [
      {
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
    ],
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

module.exports = mongoose.model("Order", userSchema);
