const JWT = require('jsonwebtoken')
const SECRET = 'SECRET'

const verify = (token) => {
  return JWT.verify(token, SECRET)
}

const signIn = (user) => {
  const { email, admin = false, _id } = user
  return JWT.sign({
    email, admin, id: _id
  }, SECRET, {
    expiresIn: '7d',
    issuer: 'ChangJoo Park',
    subject: 'User Information'
  })
}

const generateInvitation = (payload) => {
  const { team, username = '', email } = payload
  return JWT.sign({
    team, username, email}, SECRET, {
      expiresIn: '30d',
      issuer: 'ChangJoo Park',
      subject: 'User Invitation'
    })
}

module.exports = {
  verify,
  signIn,
  generateInvitation
}
