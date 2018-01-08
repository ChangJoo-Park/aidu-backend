const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const InvitationSchema = new Schema({
  code: {
    type: String,
    trim: true,
    required: true
  },
  username: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  }
})

module.exports = Mongoose.model('Invitation', InvitationSchema)
