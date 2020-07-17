const Order = require("../model/Order");

// Defining middleware
const pedidoId = async (req, res, next) => {
  //const id = (await Order.find().Count()) + 1;
  const id = (await Order.find().countDocuments()) + 1;
  const sum = req.body.products.reduce(function (s, a) {
    return s + a.price;
  }, 0);
  req.body.totalPrice = sum;
  req.body.pedidoId = id;
  next();
};
// Using it in an app for all routes (you can replace * with any route you want)

module.exports = pedidoId;
