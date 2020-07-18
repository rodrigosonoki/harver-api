const router = require("express").Router();
const Order = require("../model/Order");

router.post("/", async (req, res) => {
  const orders = await Order.findOne({ pedidoId: req.body.pedidoId }).exec();
  if (!orders) {
    return res.status(400).json({ error: "You have no orders...yet!" });
  } else if (req.user.id != orders.sellerId) {
    return res.status(401).json({ error: "Esse pedido não é seu." });
  } else {
    res.json({ order: orders.products });
  }
});

module.exports = router;
