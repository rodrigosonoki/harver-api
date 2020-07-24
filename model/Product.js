const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: "String",
      required: true,
    },
    image: {
      front: {
        type: "String",
        default: "https://source.unsplash.com/random/400x600",
      },
      back: {
        type: "String",
        default: "https://source.unsplash.com/random/400x600",
      },
    },
    price: {
      type: Number,
      required: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    dateCreated: {
      type: Date,
      default: new Date(),
    },
    skus: [{ type: mongoose.Types.ObjectId, ref: "Sku" }],
    productId: {
      type: Number,
    },
  },
  { collection: "products" }
);

module.exports = mongoose.model("Product", productSchema);
