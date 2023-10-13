const Joi = require("@hapi/joi");

//Register for User validation
const registerValidation = (data) => {
  const schema = Joi.object({
    firstname: Joi.string().min(3).max(255).required(),
    lastname: Joi.string().min(3).max(255).required(),
    email: Joi.string().max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(data);
};

//Login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(3).max(255).required(),
    password: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
