const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: "String",
      default: "Minha loja",
    },
    userId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
  },
  { collection: "stores" }
);

module.exports = mongoose.model("Store", storeSchema);
