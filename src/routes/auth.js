const router = require("express").Router();
const User = require("../model/User");
const Store = require("../model/Store");
const { registerValidation, loginValidation } = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mailer = require("../modules/mailer");

require("dotenv/config");

router.post("/register", async (req, res) => {
  // validate the user
  const { error } = registerValidation(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const isEmailExist = await User.findOne({ email: req.body.email });
  if (isEmailExist)
    return res.status(400).json({ error: "O e-mail já está cadastrado." });

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  //CREATE HASH FOR VERIFICATION (isVerified)
  const token = crypto.randomBytes(20).toString("hex");

  const url = `https://app.harver.com.br/verificar-email?token=${token}`;

  const user = new User({
    email: req.body.email,
    verificationToken: token,
    password,
  });

  //CREATE STORE
  const id = (await Store.find().countDocuments()) + 1;
  const store = new Store({
    userId: user.id,
    storeNumber: id,
  });

  try {
    await user.save();
    await store.save();

    mailer.sendMail(
      {
        to: req.body.email,
        from: "meajuda@harver.com.br",
        template: "token-verification",
        context: { url },
      },
      (err) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ error: "Deu erro." });
        }
      }
    );

    res.json("Conta criada com sucesso!");
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/login", async (req, res) => {
  // validate the user
  const { error } = loginValidation(req.body);

  //throw validation errors
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });

  //throw error when email is wrong
  if (!user) return res.status(400).json({ error: "Email is wrong" });

  //check for password correctness
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword)
    return res.status(400).json({ error: "Password is wrong" });

  //create token
  const token = jwt.sign(
    {
      email: user.email,
      id: user._id,
    },
    process.env.SECRET_TOKEN
  );

  console.log(`User ${req.body.email} just logged in...`);

  res.header("auth-token", token).json({
    error: null,
    data: {
      id: user.id,
      token,
    },
  });
});

module.exports = router;
