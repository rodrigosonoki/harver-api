const router = require("express").Router();
const Order = require("../model/Order");

router.post("/", async (req, res) => {
  // validate the user

  const order = new Order({
    sellerId: req.body.sellerId,
    order: {
      productId: req.body.order.productId,
      quantity: req.body.order.quantity,
      price: req.body.order.price,
    },
  });

  try {
    const savedOrder = await order.save();
    res.json({ error: null, data: savedOrder });
  } catch (error) {
    res.status(400).json({ error });
  }
});
module.exports = router;
