const Joi = require("@hapi/joi");
const registerValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email().required().messages({
      "string.email": `O e-mail digitado não é válido :(`,
      "string.empty": `O e-mail é obrigatório!`,
      "string.min": "digite um email valido",
    }),
    password: Joi.string().min(6).max(1024).required().messages({
      "string.min": `Sua senha precisa ter pelo menos {#limit} caracteres.`,
    }),
    password_confirmation: Joi.any()
      .valid(Joi.ref("password"))
      .required()
      .messages({ "any.ref": "A senha não coincide." }),
  });
  return schema.validate(data, { abortEarly: false });
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
};
