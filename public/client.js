const socket = io()
const sendMessage = document.getElementById('submit')
const scrollDown = document.getElementById('message-container')

function createBotMessage (data){
    const div = document.createElement('div')
    div.innerHTML = `<p class="my-2 rounded w-50 mx-auto" style="text-align: center; background-color: rgb(207, 196, 196);">${data}</p>`
    document.getElementById('message-container').appendChild(div)
}

function createMessage (obj){
    const div = document.createElement('div')
    div.innerHTML = 
    `<p class="my-2 mx-4 px-3 py-1 rounded-right bg-white border border-secondary" style="word-wrap: break-word;">
    <b class="alert-primary rounded px-1">Sofie <small><i>15:05</i></small></b>
    <br/>${obj}</p>`
    document.getElementById('message-container').appendChild(div)
}

//Notice Someine Join Or Left
socket.on('Bot-Message', data=>{
    createBotMessage(data)
    scrollDown.scrollTop = scrollDown.scrollHeight
})

//Sending Messages To Server

sendMessage.addEventListener('click',(e)=>{
    e.preventDefault()
    const message = document.getElementById('Message').value
    if(message!==''){
    socket.emit('Message',message)
    document.getElementById('Message').value = ''
    }
    else false
})

//Showing Message From Server
socket.on('User-Message',data=>{
    createMessage(data)
    scrollDown.scrollTop = scrollDown.scrollHeight
})