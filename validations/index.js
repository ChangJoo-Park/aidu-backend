const Joi = require('joi')

module.exports = {
  registration: {
    email: Joi.string().email(),
    password: Joi.string().min(8),
    username: Joi.string().min(3).max(20)
  }
}
