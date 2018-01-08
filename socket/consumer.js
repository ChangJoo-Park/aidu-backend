let io = null
exports.start = function (_io) {
  io = _io
  io.on('connection', function (socket) {
    socket.on('message', function (message) {
      console.log('from console', message.value)
    })
  })
}
exports.emit = function (event, payload) {
  if (io) {
    io.emit(event, payload)
  }
}
exports.io = function () {
  return io
}
