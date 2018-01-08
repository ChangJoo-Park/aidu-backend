'use strict'
const Invitation = require('../../models/invitation')
const User = require('../../models/user')
const Team = require('../../models/team')
const JWT = require('../../auth/jwt')

const verify = {
  method: 'POST',
  path: '/invitations/verify',
  config: {
    auth: false,
    async handler (request, h) {
      console.log(request.payload)
      const { code } = request.payload
      const verifiedCode = JWT.verify(code)
      try {
        const targetTeam = await Team.findOne({ _id: verifiedCode.team }).exec()
        const existsUser = await User.findOne({ email: verifiedCode.email }).exec()
        if (targetTeam && !existsUser) {
          return {
            ...verifiedCode,
            teamName: targetTeam.name
          }
        }
        throw new Error('Invalid Code')
      } catch (error) {
        console.log(error)
      }

      return ''
    }
  }
}

module.exports = [ verify ]
