const mongoose = require("mongoose");

const leadsSchema = new mongoose.Schema(
  {
    name: {
      type: "String",
      required: true,
    },
    email: {
      type: "String",
      required: true,
    },
    phone: {
      type: "String",
      required: true,
    },
  },
  { collection: "leads" }
);

module.exports = mongoose.model("Lead", leadsSchema);
