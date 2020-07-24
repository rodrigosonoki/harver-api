const router = require("express").Router();
const Store = require("../model/Store");
const Product = require("../model/Product");
const User = require("../model/User");

router.get("/get", async (req, res) => {
  const store = await Store.findOne({ userId: req.user.id }, { __v: 0 })
    .populate({
      path: "products",
      select: "name price image productId -_id",
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
  const id = (await Store.find().countDocuments()) + 1;
  const store = new Store({
    userId: req.user.id,
    storeNumber: id,
  });
  try {
    const savedStore = await store.save();
    res.json({ error: null, data: savedStore });
  } catch (error) {
    res.status(400).json({ error });
  }
});

//ADMIN ROUTES
//LIST ALL STORES
router.get("/get/all", async (req, res) => {
  const activeUser = await User.findById(req.user.id);
  if (activeUser.role != "admin") {
    return res.status(401).json("Acesso negado.");
  }
  const stores = await Store.find(
    {},
    { __v: 0, userId: 0, products: 0, _id: 0 }
  )
    .populate({
      path: "products",
      select: "name price image productId -_id",
    })
    .exec();

  try {
    res.json({
      stores,
    });
  } catch (err) {
    res.status(400).json({ err });
  }
});

//LIST ALL STORE'S SKUS
router.get("/get/:id/skus", async (req, res) => {
  const activeUser = await User.findById(req.user.id);
  if (activeUser.role != "admin") {
    return res.status(401).json("Acesso negado.");
  }
  id = req.params.id;
  const products = await Product.findOne(
    { storeId: id },
    {
      image: 0,
      dateCreated: 0,
      _id: 0,
      price: 0,
      storeId: 0,
      productId: 0,
      __v: 0,
    }
  )
    .populate({
      path: "skus",
      select: "skuCode",
    })
    .exec();

  try {
    res.json({ products });
  } catch (err) {
    res.status(400).json({ err });
  }
});

module.exports = router;
