const Order = require("../model/Order");

// Defining middleware
const pedidoId = async (req, res, next) => {
  //const id = (await Order.find().Count()) + 1;
  const id = (await Order.find().countDocuments()) + 1;
  req.body.pedidoId = id;
  next();
};
// Using it in an app for all routes (you can replace * with any route you want)

module.exports = pedidoId;
