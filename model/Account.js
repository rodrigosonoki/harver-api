const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
