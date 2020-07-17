const router = require("express").Router();
const Order = require("../model/Order");

router.post("/", async (req, res) => {
  const order = new Order(req.body);

  try {
    const savedOrder = await order.save();
    res.json({ error: null, data: savedOrder });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
