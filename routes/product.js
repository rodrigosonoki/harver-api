const router = require("express").Router();
const Product = require("../model/Product");
const Store = require("../model/Store");
const Sku = require("../model/Sku");

router.post("/createproduct", async (req, res) => {
  const store = await Store.findOne({ userId: req.user.id }, { __v: 0 });
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    storeId: store.id,
  });

  //ADD PRODUCT ID TO SKU
  const newSku = req.body.sku.map((i) => ({
    ...i,
    product: product._id,
  }));

  try {
    //CREATE SKUS
    const skus = await Sku.insertMany(newSku);

    //PUSH SKUS TO PRODUCT
    skus.map(async (i) => {
      await product.skus.push(i);
    });
    await product.save();
    const savedProduct = await product.save();
    store.products.push(product);
    store.save();
    res.json({
      error: null,
      data: {
        product: savedProduct,
        skus: skus,
      },
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
