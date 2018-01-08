'use strict'
const User = require('../../models/user')
const Badge = require('../../models/badge')
const Team = require('../../models/team')
const Socket = require('../../socket/consumer.js')

const get = {
  method: 'GET',
  path: '/badges',
  config: {
    auth: 'default',
    handler: function(request, h) {
      return ''
    }
  }
}

const store = {
  method: 'POST',
  path: '/badges',
  config: {
    auth: 'default',
    async handler(request, h) {
      try {
        const {id} = request.auth.credentials
        const {body, type, owner} = request.payload
        const user = await User.findById(id)
        console.log('사용자 찾음')
        const newBadge = new Badge()
        newBadge.body = body
        newBadge.type = type
        newBadge.owner = owner
        newBadge.creator = user._id
        newBadge.team = user.team
        console.log('BADGE BEFORE SAVE')
        const savedBadge = await newBadge.save()
        console.log('OWNER => ', owner)
        if (owner === 'team') {
          const team = await Team.findById(user.team)
          team.badges.push(savedBadge._id)
          await team.save()
        } else if (owner === 'member') {
          console.log('사용자 ')
          user.badges.push(savedBadge._id)
          await user.save()
        }
        Socket.emit('action', {
          type: 'badge:add',
          payload: savedBadge
        })
        return savedBadge
      } catch (error) {
        console.log(error)
        return error
      }
    }
  }
}

const update = {
  method: 'PUT',
  path: '/badges/{badgeId}',
  config: {
    auth: 'default',
    handler(request, h) {
      return ''
    }
  }
}

const destroy = {
  method: 'DELETE',
  path: '/badges/{badgeId}',
  config: {
    auth: 'default',
    async handler(request, h) {
      const {id} = request.auth.credentials
      const {badgeId} = request.params
      const badge = await Badge.findById(badgeId)

      // Validation
      if (badge === null || badge === undefined) {
        throw new Error()
      }
      if (badge.owner === 'team') {
        // 팀 요청 후 팀 owner인지 확인
      } else if (badge.owner === 'member') {
        if (badge.creator != id) {
          throw new Error()
        }
      }
      // Remove
      const removedBadge = await Badge.findByIdAndRemove(badgeId)
      Socket.emit('action', {
        type: 'badge:remove',
        payload: removedBadge
      })

      return {
        message: 'Remove Badge Successfully'
      }
    }
  }
}

module.exports = [get, store, update, destroy]
