class View {
  constructor() {
    this.recorderBtn = document.getElementById('record')
    this.leaveBtn = document.getElementById('leave')
    this.toggleVideoBtn = document.getElementById('toggle-video')
    this.toggleMicBtn = document.getElementById('toggle-mic')
    this.messageIpt = document.getElementById('chat_message')
  }

  createVideoElement({ muted = true, src, srcObject }) {
    const video = document.createElement('video')
    video.muted = muted
    video.src = src
    video.srcObject = srcObject

    if (src) {
      video.controls = true
      video.loop = true
      Util.sleep(200).then(_ => video.play())
    }
    if (srcObject) {
      video.addEventListener('loadedmetadata', _ => video.play())
    }

    return video
  }

  createMessageElement(userId, message, owner) {
    const span = document.createElement('span')
    if (owner) {
      span.classList.add('owner-user')
      span.append('Você')
    } else {
      span.classList.add('others-users')
      span.append(userId.split('-')[0])
    }

    const p = document.createElement('p')
    p.append(message)
    p.classList.add('message-content')

    const div = document.createElement('div')
    div.classList.add('message-container')
    div.append(span)
    div.append(p)

    return div
  }

  renderVideo({ userId, stream = null, url = null, isCurrentId = false }) {
    const video = this.createVideoElement({ src: url, srcObject: stream, muted: isCurrentId })
    this.appendToHTMLTree(userId, video, isCurrentId)
  }

  renderMessage(userId, message, owner) {
    const messageElement = this.createMessageElement(userId, message, owner)
    this.appendToHTMLChat(messageElement)
  }

  clearInputMessage() {
    this.messageIpt.value = ''
  }

  appendToHTMLTree(userId, video, isCurrentId) {
    const div = document.createElement('div')
    div.id = userId
    div.classList.add('wrapper')
    div.append(video)
    
    const div2 = document.createElement('div')
    div2.innerText = isCurrentId ? 'Você' : userId
    div.append(div2)

    const videoGrid = document.getElementById('video-grid')
    videoGrid.append(div)
  }

  appendToHTMLChat(message) {
    const chat = document.getElementById('chat_area')

    chat.append(message)
  }

  setParticipants(count) {
    const mySelf = 1
    const participants = document.getElementById('participants')
    participants.innerHTML = (count + mySelf)
  }

  removeVideoElement(id) {
    const element = document.getElementById(id)
    element.remove()
  }

  toogleRecordingButtonColor(isActive = true) {
    this.recorderBtn.style.color = isActive ? 'red' : 'white'
  }

  toogleVideoButtonIcon(isActive = true) {
    this.toggleVideoBtn.innerHTML = isActive 
      ? `<i class="fas fa-video"></i><span>Stop Video</span>`
      : `<i class="fas fa-video-slash"></i><span>Start Video</span>`
  }

  toogleMicButtonIcon(isActive = true) {
    this.toggleMicBtn.innerHTML = isActive 
      ? `<i class="fas fa-microphone"></i><span>Mute</span>`
      : `<i class="fas fa-microphone-slash"></i><span>Unmute</span>`
  }

  onRecordClick(command) {
    this.recordingEnabled = false
    return () => {
      const isActive = this.recordingEnabled = !this.recordingEnabled
      command(this.recordingEnabled)
      this.toogleRecordingButtonColor(isActive)
    }
  }

  onLeaveClick(command) {
    return async () => {
      command()

      await Util.sleep(3000)
      window.location = '/pages/home'
    }
  }

  onToggleVideoClick(command) {
    this.videoEnabled = true
    return async () => {
      const isActive = this.videoEnabled = !this.videoEnabled
      command(this.videoEnabled)
      this.toogleVideoButtonIcon(isActive)
    }
  }

  onToggleMicClick(command) {
    this.micEnabled = true
    return async () => {
      const isActive = this.micEnabled = !this.micEnabled
      command(this.micEnabled)
      this.toogleMicButtonIcon(isActive)
    }
  }

  onMessagePressed(event, command) {
    if (event.keyCode === 13) { //Verifica se foi pressionado a tecla 'Enter'
      command(this.messageIpt.value)
    }
  }

  configureRecordButton(command) {
    this.recorderBtn.addEventListener('click', this.onRecordClick(command))
  }

  configureLeaveButton(command) {
    this.leaveBtn.addEventListener('click', this.onLeaveClick(command))
  }

  configureToggleVideoButton(command) {
    this.toggleVideoBtn.addEventListener('click', this.onToggleVideoClick(command))
  }

  configureToggleMicButton(command) {
    this.toggleMicBtn.addEventListener('click', this.onToggleMicClick(command))
  }

  configureMessageInput(command) {
    this.messageIpt.addEventListener('keyup', event => this.onMessagePressed(event, command))
  }
}