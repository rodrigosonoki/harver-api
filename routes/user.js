const router = require("express").Router();
const User = require("../model/User");

router.get("/getinfo", async (req, res) => {
  const user = await User.findById(req.user.id);
  if (req.user.id != user.id) {
    return res.status(401).json("Acesso negado.");
  }
  res.json({
    user: {
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    },
  });
});

module.exports = router;
