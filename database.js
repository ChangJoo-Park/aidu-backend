const Mongoose = require('mongoose')

// Load Database
Mongoose.connect('mongodb://localhost:27017/teamtab-hapi-mongoose')
const db = Mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))

db.once('open', function callback () {
  console.log('Connection with database succeeded.')
})

exports.db = db
