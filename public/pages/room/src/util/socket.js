class SocketBuilder {
  constructor({ socketUrl }) {
    this.socketUrl = socketUrl
    this.onUserConnected = () => {}
    this.onUserDisconnected = () => {}
    this.onNewMessage = () => {}
  }

  setOnUserConnected(fn) {
    this.onUserConnected = fn
    return this
  }

  setOnUserDisconnected(fn) {
    this.onUserDisconnected = fn
    return this
  }

  setOnNewMessage(fn) {
    this.onNewMessage = fn
    return this
  }

  build() {
    const socket = io.connect(this.socketUrl, {
      withCredentials: false
    })

    socket.on('user-connected', this.onUserConnected)
    socket.on('user-disconnected', this.onUserDisconnected)
    socket.on('new-message', this.onNewMessage)

    return socket
  }
}