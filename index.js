'use strict'

const Hapi = require('hapi')
const auth = require('./auth')
const routes = require('./routes')
const db = require('./database').db
const SocketIO = require('socket.io')

// Create a server with a host and port
const server = Hapi.server({
  host: 'localhost',
  port: 8000
})

const io = SocketIO.listen(server.listener)
const consumer = require('./socket/consumer.js')
consumer.start(io)

// Start the server
async function start () {
  try {
    // Add auth
    server.auth.scheme('custom', auth.scheme)
    server.auth.strategy('default', 'custom')

    server.route(routes, {
      cors: true
    })
    await server.start()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }

  console.log('Server running at:', server.info.uri)
}

start()
