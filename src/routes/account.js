const router = require("express").Router();
const Account = require("../model/Account");
const Store = require("../model/Store");

router.get("/getinfo", async (req, res) => {
  const store = await Store.findOne({ userId: req.user.id });
  const account = await Account.findOne({ storeId: store.id }).exec();
  console.log(account);
  if (req.user.id != store.userId) {
    return res.status(401).json("Acesso negado.");
  }
  try {
    res.json({
      account: {
        bank: account.bank.name,
        agency: account.bank.agency,
        accountNumber: account.bank.account,
      },
    });
  } catch (err) {
    res.status(400).json({ err });
  }
});

router.post("/createInfo", async (req, res) => {
  const store = await Store.findOne({ userId: req.user.id });
  req.body.storeId = store.id;

  const account = new Account(req.body);
  try {
    await account.save();
    res.json("Conta criada com sucesso.");
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.put("/update", async (req, res) => {
  const store = await Store.findOne({ userId: req.user.id });
  const account = await Account.findOneAndUpdate(
    { storeId: store.id },
    req.body,
    { new: true }
  );

  try {
    await account.save();
    res.json("Conta atualizada.");
  } catch (err) {
    res.status(400).json({ err });
  }
});

module.exports = router;
