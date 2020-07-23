const router = require("express").Router();
const Account = require("../model/Account");

router.get("/getinfo", async (req, res) => {
  const account = await Account.findOne({ userId: req.user.id }).exec();
  if (req.user.id != account.userId) {
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
  req.body.userId = req.user.id;
  const account = new Account(req.body);
  try {
    await account.save();
    res.json("Conta criada com sucesso.");
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
