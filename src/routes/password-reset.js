const crypto = require("crypto");
const router = require("express").Router();
const User = require("../model/User");
const mailer = require("../modules/mailer");
const bcrypt = require("bcrypt");

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(200).send();

  const token = crypto.randomBytes(20).toString("hex");

  const url = `https://app.harver.com.br/esqueci-minha-senha?email=${email}&token=${token}`;

  /* SETTING EXPIRATION TIME: 1 HOUR */
  const now = new Date();
  now.setHours(now.getHours() + 1);

  try {
    await User.findByIdAndUpdate(
      user.id,
      {
        $set: {
          passwordResetToken: token,
          passwordResetExpires: now,
        },
      },
      {
        useFindAndModify: false,
      }
    );

    mailer.sendMail(
      {
        to: email,
        from: "meajuda@harver.com.br",
        template: "password-reset",
        context: { url },
      },
      (err) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ error: "Deu erro." });
        }

        return res.status(200).send();
      }
    );
  } catch (err) {
    res.status(400).json({ error: "Unknown error. Try again" });
  }
});

router.post("/reset", async (req, res) => {
  const { password } = req.body;
  const { token, email } = req.query;
  const user = await User.findOne({ email }).select(
    "+passwordResetToken +passwordResetExpires"
  );

  if (!user) return res.status(400).send({ error: "User not found" });

  if (token !== user.passwordResetToken)
    return res.status(400).send({ error: "Token inválido" });

  const now = new Date();

  if (now > user.passwordResetExpires)
    return res.status(400).json({ error: "Token expirado" });

  try {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    user.password = encryptedPassword;
    await user.save();
    res.status(200).send();
  } catch (err) {
    res.status(400).send().json({ err });
  }
});

module.exports = router;
