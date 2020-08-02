const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "24ac11a9af3d57",
    pass: "4e15c46f6ef375",
  },
});

transport.use(
  "compile",
  hbs({
    viewEngine: {
      extName: ".html",
      partialsDir: path.resolve("./src/assets/mail/"),
      layoutsDir: path.resolve("./src/assets/mail/"),
      defaultLayout: "password-reset.html",
    },
    viewPath: path.resolve("./src/assets/mail/"),
    extName: ".html",
  })
);

module.exports = transport;
