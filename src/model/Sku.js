const mongoose = require("mongoose");

const skuSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    skuCode: {
      type: "String",
      required: true,
    },
    color: {
      type: "String",
      required: true,
    },
    size: {
      type: "String",
      required: true,
    },
    quantityAvailable: {
      type: Number,
    },
  },
  { collection: "skus" }
);

module.exports = mongoose.model("Sku", skuSchema);
