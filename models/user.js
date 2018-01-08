const Mongoose = require('mongoose')
const hash = require('../utils/hash')
const JWT = require('../auth/jwt')

const Schema = Mongoose.Schema
const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    index: true,
    unique: true
  },
  title: {
    type: String,
    trim: true,
    required: false
  },
  password: String,
  isAdmin: {
    type: Boolean,
    default: false
  },
  roles: {
    type: String,
    enum: ['team-member', 'team-owner'],
    default: 'team-member'
  },
  isRemote: {
    type: Boolean,
    default: false
  },
  isDoNotDisturb: {
    type: Boolean,
    default: false
  },
  nextIn: {
    type: String,
    default: ''
  },
  nextOut: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  badges: [{type: Schema.Types.ObjectId, ref: 'Badge'}]
})

UserSchema.pre('save', function(next) {
  if (this.password && this.isModified('password')) {
    this.password = hash.encrypt(this.password)
    console.log('password hashed => ', this.password)
  }
  next()
})

UserSchema.methods = {
  async passwordMatches(password) {
    return hash.compare(password, this.password)
  }
}

UserSchema.statics = {
  async findByEmail(email) {
    return this.findOne({email}).exec()
  },
  async findAndGenerateToken({email, password}) {
    const user = await this.findOne({email}).exec()
    console.log('user => ', user)
    if (password) {
      console.log('password => ', password)
      console.log(await user.passwordMatches(password))
      if (user && (await user.passwordMatches(password))) {
        const token = await JWT.signIn(user)
        return token
      }
      throw new Error({
        code: '',
        name: '',
        message: ''
      })
      // TODO: 비밀번호 틀렸을 때 처리
    }
  },
  async findByIdAndPopulate(userId) {
    const user = await this.findOne({_id: userId})
      .populate({
        path: 'team',
        populate: {path: 'members', populate: {path: 'badges'}}
      })
      .populate({path: 'team', populate: {path: 'owner'}})
      .populate({path: 'team', populate: {path: 'badges'}})
      .populate('badges')
      .exec()
    return user
  }
}

module.exports = Mongoose.model('User', UserSchema)
