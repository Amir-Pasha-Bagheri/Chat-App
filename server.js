const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const moment = require('moment')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const members = []

//User Message 
const Message = (username , text) =>{
  return {
    username,
    text,
    time: moment().format('h:mm a'),
    id: members.length
  }
} 

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

  //Adding To Memberlist
  socket.on('Add-Member',username=>{
    members.push(username.username)
    io.emit('Pass-Array-Add',members)
  })

  //Removing From Memberlist
  socket.on('Remove-Member',username=>{
    socket.on('disconnect',()=>{
      const index = members.indexOf(username.username)
      const newMembers = members.splice(index,1)
      io.emit('Pass-Array-Remove',members)
    })
  })
  
  socket.on('Bot',username=>{
    manageMessagea.Userjoin(socket,`${username.username} Joined The Chat !`) 
    socket.on('disconnect',()=>manageMessagea.Userleft(socket,`${username.username} Left The Chat !`))
  })

  socket.on('Message',(username,message)=> {
    socket.broadcast.emit('Users-Message',Message(username.username,message))
    socket.emit('Your-Message',Message('You',message))
  })
})

server.listen(3000,()=>console.log('Running On Port 3000...'))