const Mongoose = require('mongoose')

const Schema = Mongoose.Schema
const BadgeSchema = new Schema({
  body: {
    type: String,
    trim: true,
    default: '',
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'emoji'],
    required: true,
    default: 'text'
  },
  owner: {
    type: String,
    enum: ['member', 'team'],
    required: true,
    default: 'member'
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = Mongoose.model('Badge', BadgeSchema)
