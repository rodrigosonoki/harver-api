const router = require("express").Router();
const User = require("../model/User");

router.get("/", async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({
    user: {
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    },
  });
});

module.exports = router;
