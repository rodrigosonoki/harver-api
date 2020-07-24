const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    bank: {
      name: {
        type: "String",
        required: true,
      },
      agency: {
        type: "String",
        required: true,
      },
      account: {
        type: "String",
        required: true,
      },
    },
  },
  { collection: "accounts" }
);

module.exports = mongoose.model("Account", accountSchema);
