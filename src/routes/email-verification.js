const router = require("express").Router();
const User = require("../model/User");

router.post("/", async (req, res) => {
  const { token } = req.query;
  const user = await User.findOneAndUpdate(
    { verificationToken: token },
    { isVerified: true }
  );

  if (!user) return res.status(400).send({ error: "Token inválido." });

  try {
    await user.save();
    res.status(200).send();
  } catch (err) {
    res.status(400).send().json({ err });
  }
});

module.exports = router;
