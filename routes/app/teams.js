'use strict'
const User = require('../../models/user')
const Team = require('../../models/team')
const Badge = require('../../models/badge')
const Invitation = require('../../models/invitation')
const Socket = require('../../socket/consumer.js')
const JWT = require('../../auth/jwt')

const get = {
  method: 'GET',
  path: '/teams',
  config: {
    auth: 'default',
    handler: function (request, h) {
      return ''
    }
  }
}

const store = {
  method: 'POST',
  path: '/teams',
  config: {
    auth: false,
    async handler (request, h) {
      try {
        console.log(request.payload)
        const { id } = request.payload
        const user = await User.findOne({ _id: id })
        if (user === null) {
          throw new Error('사용자 없음')
        }
        console.log('user.team => ', user.team)
        if (user.team !== undefined) {
          throw new Error('Already exists team')
        }
        console.log('팀 만들 수 있음')
        const { name } = request.payload
        const newTeam = new Team()
        newTeam.name = name
        newTeam.owner = user._id
        newTeam.members.push(user._id)
        newTeam.badges = []
        const savedTeam = await newTeam.save()
        console.log('팀 저장됨')
        user.team = savedTeam._id
        await user.save()
        return savedTeam
      } catch (error) {
        console.log(error)
        return error
      }
    }
  }
}

const update = {
  method: 'PUT',
  path: '/teams/{teamId}',
  config: {
    auth: 'default',
    async handler (request, h) {
      try {
        console.log('TEAM UPDATE')
        const updatedTeam = await Team.update({ _id: request.params.teamId },
          { $set: request.payload })
        Socket.emit('action', {
          type: 'team:update',
          payload: request.payload
        })
        return updatedTeam
      } catch (error) {
        console.log(error)
      }
    }
  }
}

const destroy = {
  method: 'DELETE',
  path: '/teams/{teamId}',
  config: {
    auth: 'default',
    handler: function (request, h) {
      return ''
    }
  }
}

/**
 * GET Team members
 */
const getMembers = {
  method: 'GET',
  path: '/teams/{teamId}/members',
  config: {
    auth: 'default',
    handler: function (request, h) {
      return ''
    }
  }
}

const storeMember = {
  method: 'POST',
  path: '/teams/{teamId}/members',
  config: {
    auth: false, // FIXME: Need auth by jwt
    async handler (request, h) {
      try {
        const { username, email, password, code } = request.payload
        console.log('payload => ', request.payload)
        const newUser = new User()
        newUser.username = username
        newUser.email = email
        newUser.password = password
        newUser.team = request.params.teamId
        console.log('newUser => ', newUser)
        const savedUser = await newUser.save()
        console.log('savedUser => ', savedUser)
        const targetTeam = await Team.findOne({ _id: request.params.teamId }).exec()
        console.log('targetTeam => ', targetTeam)
        targetTeam.members.push(savedUser._id)
        console.log('=====')
        console.log('target Team => ', targetTeam)
        await targetTeam.save()

        return {
          message: 'Join Succeed'
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}

const getBadges = {
  method: 'GET',
  path: '/teams/{teamId}/badges',
  config: {
    auth: 'default',
    handler: function (request, h) {
      return ''
    }
  }
}

const storeBadge = {
  method: 'POST',
  path: '/teams/{teamId}/badges',
  config: {
    auth: 'default',
    async handler (request, h) {
      try {
        const { teamId } = request.params
        const requestTeam = await Team.findById(teamId)
        if (requestTeam === null) {
          throw new Error('없는 팀 입니다.')
        }
        const { id } = request.auth.credentials
        const requestUser = await User.findById(id)
        if (requestUser === null || id != requestTeam.owner) {
          throw new Error('없는 사용자입니다.')
        }
        const newBadge = new Badge()
        const { body, type, owner } = request.payload
        newBadge.body = body
        newBadge.type = type
        newBadge.owner = owner
        newBadge.creator = id
        newBadge.team = teamId
        const savedBadge = await newBadge.save()
        requestTeam.badges.push(savedBadge)
        requestTeam.save()

        return savedBadge
      } catch (error) {
        console.log(error)
      }
    }
  }
}
const getInvitations = {
  method: 'GET',
  path: '/teams/{teamId}/invitations',
  config: {
    auth: 'default',
    async handler (request, h) {
      try {
        const teamId = request.params.teamId
        const invitations = await Invitation.find({ team: teamId }).exec()
        return invitations
      } catch (error) {
        console.log(error)
      }
    }
  }
}

const storeInvitation = {
  method: 'POST',
  path: '/teams/{teamId}/invitations',
  config: {
    auth: 'default',
    async handler (request, h) {
      try {
        console.log('hello')
        // Request Validate
        const payload = {
          ...request.payload,
          team: request.params.teamId
        }
        const code = JWT.generateInvitation(payload)
        console.log(code)
        console.log(payload)
        const newInvitation = new Invitation()
        newInvitation.code = code
        newInvitation.username = payload.username
        newInvitation.email = payload.email
        newInvitation.team = request.params.teamId

        const savedInvitation = await newInvitation.save()
        console.log('savedInvitation => ', savedInvitation)
        return savedInvitation
      } catch (error) {
        console.log(error)
      }
    }
  }
}

module.exports = [
  get, store, update, destroy,
  getMembers, storeMember, getBadges, storeBadge,
  getInvitations, storeInvitation
]
