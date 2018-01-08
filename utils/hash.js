const bcrypt = require('bcrypt-nodejs')

module.exports = {
  encrypt (password) {
    let salt = bcrypt.genSaltSync() // enter number of rounds, default: 10
    let hash = bcrypt.hashSync(password, salt)
    return hash
  },
  compare (password, targetPassword) {
    return bcrypt.compareSync(password, targetPassword)
  }
}
