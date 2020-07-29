const router = require("express").Router();
const Lead = require("../model/Lead");

router.post("/new", async (req, res) => {
  console.log(req.body);
  const lead = new Lead({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  });

  try {
    await lead.save();
    res.json({ code: "200", msg: "Enviado com sucesso!" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
