const Mongoose = require('mongoose')

const Schema = Mongoose.Schema
const TeamSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  badges: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Badge'
    }
  ],
  invitations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Invitation'
    }
  ]
})

module.exports = Mongoose.model('Team', TeamSchema)
