const router = require("express").Router();
const Order = require("../model/Order");
const Store = require("../model/Store");
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

//ADMIN
//GET ALL ORDERS FROM ALL USERS
router.get("/getorder/admin", async (req, res) => {
  const activeUser = await User.findById(req.user.id);
  if (activeUser.role != "admin") {
    return res.status(401).json("Acesso negado.");
  }

  const orders = await Order.find();

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
  const orders = await Order.findOne({ orderId: id }).exec();

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
      select: "-_id -dateCreated  -storeId -__v",
    })
    .exec();

  if (!orders) {
    return res.status(400).json({ error: "You have no orders...yet!" });
  } else {
    res.json({ order: products, orders });
  }
});

//CREATE ORDER
router.post("/createorder", async (req, res) => {
  //CHECK IF ADMIN
  const activeUser = await User.findById(req.user.id);
  if (activeUser.role === "admin") {
    /* HANDLING ERRORS:
    NEGATIVE QUANTITY */
    const quantityCheck = req.body.sku.map((i) => {
      if (i.quantity < 1) {
        return true;
      } else return false;
    });

    if (quantityCheck.includes(true))
      return res.json({ msg: "Quantidade inválida" });

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
        select: "-_id -image -dateCreated -skus -name -__v",
      })
      .exec();

    const store = await Store.findOne({ storeNumber: req.body.storeNumber });

    /* HANDLING ERROR:
    STORENUMBER IS INVALID */
    if (!store) {
      return res.json({ msg: "ID da loja inválido" });
    }

    /* HANDLING ERROR:
SKU BELONG TO DIFFERENT STORES */

    const skuCheck = products.map((i) => {
      if (JSON.stringify(i.product.storeId) === JSON.stringify(store._id)) {
        return true;
      } else return false;
    });

    if (skuCheck.includes(false)) {
      return res.json({ msg: "Os skus pertencem a lojas diferentes" });
    }

    /* HANDLING ERROR:
    SKUCODE IS INVALID */
    if (products.length != skuArray.length) {
      return res.json({ msg: "Tem algum sku inválido" });
    }

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

    const storeVerify = await Store.findById(products[0].product.storeId);

    /* HANDLING ERROR:
    PRODUCT BELONGS TO STORE */
    if (store.storeNumber != storeVerify.storeNumber)
      return res.json({ msg: "Os produtos não pertecem à loja" });

    const id = (await Order.find().countDocuments()) + 1;

    const order = new Order({
      totalPrice: sum,
      orderId: id,
      storeId: store.id,
      skus: req.body.sku,
    });

    try {
      const savedOrder = await order.save();
      order.save();
      res.json({ msg: `Pedido #${id} criado`, data: savedOrder });
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    res.status(401).json("Acesso negado.");
  }
});

module.exports = router;
