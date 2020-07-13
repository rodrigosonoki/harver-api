const router = require("express").Router();
const Order = require("../model/Order");

router.get("/", async (req, res) => {
  const order = await Order.find({ sellerId: req.user.id });
  if (!order) {
    return res.status(400).json({ error: "You have no orders...yet!" });
  }
  res.json({
    data: {
      user: req.user,
    },
    order,
  });
});
module.exports = router;
