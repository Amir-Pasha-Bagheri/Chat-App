const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

//message if You Enter the chat
const manageMessagea = {
  Ujoin: function (socket,data){
  socket.emit('Bot-Message',data)
  },
  Userjoin: function (socket,data){
    socket.broadcast.emit('Bot-Message',data)
  },
  Userleft: function (socket,data){
    socket.broadcast.emit('Bot-Message',data)
  }
}

app.use(express.static(path.join(__dirname,'public')))

io.on('connection', socket =>{
  manageMessagea.Ujoin(socket,'You Joined The Chat !')
  manageMessagea.Userjoin(socket,`Someone Joined The Chat !`)
  socket.on('disconnect',()=>manageMessagea.Userleft(socket,`Someone Left The Chat !`))
  socket.on('Message',(message)=> io.emit('User-Message',message))
})

server.listen(3000,()=>console.log('Running On Port 3000...'))