const authController = require('../controllers/auth')

const registration = {
  method: 'POST',
  path: '/register',
  config: {
    auth: false,
    handler: authController.signup
  }
}

const login = {
  method: 'POST',
  path: '/login',
  config: {
    auth: false,
    handler: authController.login
  }
}

const getMe = {
  method: 'GET',
  path: '/me',
  config: {
    auth: 'default',
    handler: authController.getMe
  }
}

const updateMe = {
  method: 'PUT',
  path: '/me',
  config: {
    auth: 'default',
    handler: authController.updateMe
  }
}
module.exports = [
  {
    method: 'GET',
    path: '/status',
    config: {
      auth: false,
      handler (request, h) {
        return {
          status: 'ok'
        }
      }
    }
  },
  login,
  registration,
  getMe,
  updateMe
]
