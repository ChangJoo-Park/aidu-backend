const auth = require('./auth')
const members = require('./app/members')
const teams = require('./app/teams')
const badges = require('./app/badges')
const invitations = require('./app/invitations')

module.exports = [
  ...auth, ...members, ...teams, ...badges, ...invitations
]
