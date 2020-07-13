const router = require("express").Router();
const Order = require("../model/Order");

router.get("/", async (req, res) => {
  const order = await Order.find({ sellerId: req.body.id });
  if (!order) {
    return res.status(400).json({ error: "You have no orders...yet!" });
  }
  res.json({
    order,
  });
});
module.exports = router;
