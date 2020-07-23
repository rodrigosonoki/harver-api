const router = require("express").Router();
const Account = require("../model/Account");

router.get("/getinfo", async (req, res) => {
  const account = await Account.findOne({ userId: req.user.id }).exec();
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
  const account = new Account(req.body);
  try {
    const savedAccount = await account.save();
    res.json({ error: null, data: savedAccount });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
