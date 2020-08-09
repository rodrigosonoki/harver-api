const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: "String",
      default: "Minha loja",
    },
    storeNumber: {
      type: Number,
      required: true,
    },
    userId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    bank: {
      name: {
        type: "String",
        default: "",
      },
      agency: {
        type: "String",
        default: "",
      },
      account: {
        type: "String",
        default: "",
      },
    },
  },
  { collection: "stores" }
);

module.exports = mongoose.model("Store", storeSchema);
