const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const moment = require('moment')
const {getUser,currentUser,userLeave,getRoom} = require('./public/users') 

const app = express()
const server = http.createServer(app)
const io = socketio(server)

//User Message 
const Message = (username , text) =>{
  return {
    username,
    text,
    time: moment().format('h:mm a')
  }
}

app.use(express.static(path.join(__dirname,'public')))

io.on('connection', socket =>{

  socket.on('Join',Query=>{
    const user = getUser(socket.id,Query.username,Query.room)
  
    socket.join(user.room)
    
    socket.emit('Bot-Message','You Joined The Chat !')

    socket.broadcast.to(user.room).emit('Bot-Message',`${user.username} Joined The Chat !`)
    
    //Adding To Memberlist
    const userForList = getRoom(user.room)
    io.to(user.room).emit('Pass-Array',userForList)
  })


  
  socket.on('Message',(message)=> {
    const user = currentUser(socket.id)
    socket.broadcast.to(user.room).emit('Users-Message',Message(user.username,message))
    socket.emit('Your-Message',Message('You',message))
  })
  
  socket.on('disconnect',()=>{
    const user = userLeave(socket.id)
    if(user){
      socket.broadcast.to(user.room).emit('Bot-Message',`${user.username} Left The Chat !`)
      //Removing From Memberlist
      const userForList = getRoom(user.room)
      io.to(user.room).emit('Pass-Array',userForList)
    }
  })
  
})

server.listen(3000,()=>console.log('Running On Port 3000...'))