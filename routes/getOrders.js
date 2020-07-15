const router = require("express").Router();
const Order = require("../model/Order");

router.get("/", async (req, res) => {
  const orders = await Order.find(
    { sellerId: req.user.id },
    { _id: 0, sellerId: 0, __v: 0 }
  );

  if (!orders) {
    return res.status(400).json({ error: "You have no orders...yet!" });
  }
  res.json({
    orders,
  });
});

module.exports = router;
