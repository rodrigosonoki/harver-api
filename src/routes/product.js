const router = require("express").Router();
const Product = require("../model/Product");
const Store = require("../model/Store");
const Sku = require("../model/Sku");
const User = require("../model/User");

router.post("/createproduct", async (req, res) => {
  //CHECK IF ADMIN
  const activeUser = await User.findById(req.user.id);
  if (activeUser.role === "admin") {
    const store = await Store.findOne(
      { storeNumber: req.body.storeNumber },
      { __v: 0 }
    );

    /* HANDLING ERRORS:
      WRONG STORENUMBER */
    if (!store) return res.json({ msg: "Verifique o ID da loja" });

    /* HANDLING ERRORS:
      EMPTY PRODUCT NAME */

    if (!req.body.name) return res.json({ msg: "O campo nome é obrigatório" });

    /* HANDLING ERRORS:
      EMPTY PRODUCT PRICE */

    if (!req.body.price)
      return res.json({ msg: "O campo preço é obrigatório" });

    /* HANDLING ERRORS:
      CHECK IF SKUCODE ALREADY EXISTS */

    //CHECK PRODUCTS FROM SKUCODE
    const request = req.body.sku;

    /* HANDLING ERRORS:
      EMPTY SKU ARRAY */
    if (!request) return res.json({ msg: "Os skus são obrigatórios" });

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
    );

    if (products.length != 0)
      return res.json({
        msg: "Já existem produtos cadastrados com os mesmo skus",
      });

    /* HANDLING ERRORS:
    EMPTY SIZE */

    const sizeArray = request.map((i) => {
      return i.size;
    });

    if (sizeArray.includes(""))
      return res.json({ msg: "O tamanho é obrigatório" });

    const id = (await Product.find().countDocuments()) + 1;
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      storeId: store.id,
      productId: id,
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
      store.products.push(product);
      await store.save();
      res.json({ msg: "Produto criado!" });
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    return res.status(401).json("Acesso negado.");
  }
});

module.exports = router;
