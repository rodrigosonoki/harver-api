const router = require("express").Router();
const Order = require("../model/Order");
const Store = require("../model/Store");
const Product = require("../model/Product");
const User = require("../model/User");
const Sku = require("../model/Sku");

//GET ALL ORDERS FROM USER
router.get("/getorder", async (req, res) => {
  const store = await Store.findOne(
    { userId: req.user.id },
    { __v: 0, name: 0, products: 0 }
  );

  const orders = await Order.find(
    { storeId: store.id },
    {
      _id: 0,
      storeId: 0,
      __v: 0,
    }
  );

  if (!store.userId.includes(req.user.id)) {
    return res.status(401).json({ error: "Acesso negado." });
  }

  try {
    res.json({
      orders,
    });
  } catch (err) {
    res.status(400).json({ err });
  }
});

//GET ORDER BY ID FROM USER
router.get("/:id", async (req, res) => {
  id = req.params.id;
  const orders = await Order.findOne({ pedidoId: id }).exec();
  const store = await Store.findById(orders.storeId).exec();
  if (!store.userId.includes(req.user.id)) {
    return res.status(401).json("Acesso negado");
  }
  const skuCodes = orders.skus.map((i) => {
    return i.skuCode;
  });

  const products = await Sku.find(
    { skuCode: { $in: skuCodes } },
    {
      _id: 0,
      quantityAvailable: 0,
      __v: 0,
    }
  )
    .populate({
      path: "product",
      select: "-_id -dateCreated -skus -storeId -__v",
    })
    .exec();

  if (!orders) {
    return res.status(400).json({ error: "You have no orders...yet!" });
  } else {
    res.json({ order: products });
  }
});

//CREATE ORDER
router.post("/createorder", async (req, res) => {
  //CHECK IF ADMIN
  const activeUser = await User.findById(req.user.id);
  if (activeUser.role === "admin") {
    //CHECK PRODUCTS FROM SKUCODE
    const request = req.body.sku;
    const skuArray = request.map((i) => {
      return i.skuCode;
    });

    const products = await Sku.find(
      { skuCode: { $in: skuArray } },
      {
        _id: 0,
        color: 0,
        size: 0,
        quantityAvailable: 0,
        __v: 0,
      }
    )
      .populate({
        path: "product",
        select: "-_id -image -dateCreated -skus -name -storeId -__v",
      })
      .exec();

    //CREATE NEW ARRAY WITH PRICE AND QUANTITY -- I AM MUITO FODA, KRL.
    const newArr = req.body.sku.map((i) => ({
      ...i,
      price: products.find((item) => item.skuCode === i.skuCode).product.price,
    }));

    const productsArr = [];

    for (i = 0; i < newArr.length; i++) {
      productsArr.push(Object.values(newArr[i]));
    }

    const a = [];

    for (i = 0; i < newArr.length; i++) {
      a.push(productsArr[i].slice(1));
    }

    const b = [];

    for (i = 0; i < newArr.length; i++) {
      b.push(a[i].reduce((a, b) => a * b, 1));
    }

    const c = [];

    c.push(b.reduce((a, b) => a + b, 0));

    //SETTING THE VALUES CORRECTLY
    const sum = c[0];

    const store = await Store.findById(req.body.storeId);

    const id = (await Order.find().countDocuments()) + 1;

    const order = new Order({
      totalPrice: sum,
      pedidoId: id,
      storeId: store.id,
      skus: req.body.sku,
    });

    try {
      const savedOrder = await order.save();
      order.save();
      res.json({ error: null, data: savedOrder });
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    res.status(401).json("Acesso negado.");
  }
});

module.exports = router;
