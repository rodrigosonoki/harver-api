const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const transport = nodemailer.createTransport({
  host: "smtp.umbler.com",
  port: 587,
  auth: {
    user: "meajuda@harver.com.br",
    pass: "xs*knyQYNF8u7@W",
  },
});

transport.use(
  "compile",
  hbs({
    viewEngine: {
      extName: ".html",
      partialsDir: path.resolve("src/assets/mail/"),
      layoutsDir: path.resolve("src/assets/mail/"),
      defaultLayout: false,
    },
    viewPath: path.resolve("src/assets/mail/"),
    extName: ".html",
  })
);

module.exports = transport;
