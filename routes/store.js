const router = require("express").Router();
const Store = require("../model/Store");

router.get("/get", async (req, res) => {
  const store = await Store.findOne({ userId: req.user.id }, { __v: 0 })
    .populate({
      path: "products",
      select: "name price image -_id",
    })
    .exec();

  try {
    res.json({
      store: store,
    });
  } catch (err) {
    res.status(400).json({ err });
  }
});

router.post("/create", async (req, res) => {
  const store = new Store({
    userId: req.user.id,
  });
  try {
    const savedStore = await store.save();
    res.json({ error: null, data: savedStore });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
