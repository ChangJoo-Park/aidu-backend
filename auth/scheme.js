const Boom = require('boom')
const JWT = require('./jwt')

module.exports = (server, options) => {
  return {
    api: {
      settings: {
        x: 5
      }
    },
    async authenticate (request, h) {
      const authorization = request.headers.authorization
      if (!authorization) {
        throw Boom.unauthorized(null, 'Custom')
      }
      try {
        const { id, email, admin, teamId = '' } = await JWT.verify(authorization)
        return h.authenticated({ credentials: { id, email, admin, teamId } })
      } catch (error) {
        throw Boom.unauthorized('Invalid Authorization token')
      }
    }
  }
}
