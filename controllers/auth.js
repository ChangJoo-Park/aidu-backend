const User = require('../models/user')
const Socket = require('../socket/consumer.js')

const signup = async (request, h) => {
  try {
    // TODO: Need Validation
    const { email, username, password } = request.payload
    const registeredUser = await User.findByEmail(email)
    if (registeredUser) { // 이미 사용자가 있음
      console.log('이미 있는 사용자')
      throw new Error()
    }
    const newUser = new User({ email, username, password })
    const savedUser = await newUser.save()

    return savedUser
  } catch ({ code, name, message }) {
    return {
      statusCode: code,
      error: name,
      message: message
    }
  }
}

const login = async (request, h) => {
  try {
    const { email, password } = request.payload
    const token = await User.findAndGenerateToken({ email, password })
    console.log('token => ', token)
    return {
      message: 'login succeed',
      token
    }
  } catch (error) {
    console.log('error => ', error)
    return {
      statusCode: error.code,
      error: error.name,
      message: error.message
    }
  }
}

const getMe = async (request, h) => {
  try {
    const { id: userId } = request.auth.credentials
    const myInfo = await User.findByIdAndPopulate(userId)
    Socket.emit('action', { payload: 'hello world' })
    return myInfo
  } catch ({ code: statusCode, name: error, message }) {
    return { statusCode, error, message }
  }
}

const updateMe = async (request, h) => {

}

module.exports = {
  signup,
  login,
  getMe,
  updateMe
}
