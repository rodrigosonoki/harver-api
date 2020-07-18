const router = require("express").Router();
const Order = require("../model/Order");

router.post("/", async (req, res) => {
  const orders = await Order.findOne({ pedidoId: req.body.pedidoId }).exec();
  if (!orders) {
    return res.status(400).json({ error: "You have no orders...yet!" });
  }
  res.json({ order: orders.products });
});

module.exports = router;
