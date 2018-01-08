'use strict'
const User = require('../../models/user')
const Socket = require('../../socket/consumer.js')

const get = {
  method: 'GET',
  path: '/members',
  config: {
    auth: 'default',
    handler: function (request, h) {
      return ''
    }
  }
}

const store = {
  method: 'POST',
  path: '/members',
  config: {
    auth: 'default',
    handler: function (request, h) {
      return ''
    }
  }
}

const update = {
  method: 'PUT',
  path: '/members/{memberId}',
  config: {
    auth: 'default',
    handler: function (request, h) {
      return ''
    }
  }
}

const updateStatus = {
  method: 'PUT',
  path: '/members/{memberId}/status',
  config: {
    auth: 'default',
    async handler (request, h) {
      try {
        const updatedUser = await User.update({ _id: request.params.memberId },
          { $set: request.payload })
        request.payload.memberId = request.params.memberId
        Socket.emit('action', {
          type: 'status:update',
          payload: request.payload
        })
        return updatedUser
      } catch (error) {
        console.error(error)
      }
    }
  }
}
const destroy = {
  method: 'DELETE',
  path: '/members/{memberId}',
  config: {
    auth: 'default',
    handler: function (request, h) {
      return ''
    }
  }
}

module.exports = [get, store, update, destroy, updateStatus]
