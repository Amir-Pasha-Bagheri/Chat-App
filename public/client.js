const socket = io()
const sendMessage = document.getElementById('submit')
const scrollDown = document.getElementById('message-container')
const input = document.getElementById('Message')

input.onfocus = function(){
    if(div.style.display === 'block'){
        div.style.display = 'none'
    }
}

//Getting Name From Query
const Query = Qs.parse(location.search,{
    ignoreQueryPrefix : true
})

document.getElementById('room-name').innerHTML = Query.room

function createBotMessage (data){
    const div = document.createElement('div')
    div.innerHTML = `<p class="my-2 rounded w-50 mx-auto" style="text-align: center; background-color: rgb(207, 196, 196);">${data}</p>`
    document.getElementById('message-container').appendChild(div)
}

function createUsersMessage (obj){
    const div = document.createElement('div')
    div.innerHTML = 
    `<p class="my-2 mx-4 px-3 py-1 rounded-right bg-white border border-secondary" style="word-wrap: break-word;">
    <b class="alert-primary rounded px-1">${obj.username} <small><i>${obj.time}</i></small></b>
    <br/>${obj.text}</p>`
    document.getElementById('message-container').appendChild(div)
}

function createYourMessage (obj){
    const div = document.createElement('div')
    div.innerHTML = 
    `<p class="my-2 mx-4 px-3 py-1 rounded-right alert-success border border-secondary" style="word-wrap: break-word;">
    <b class="bg-success text-white rounded px-1">You <small><i>${obj.time}</i></small></b>
    <br/>${obj.text}</p>`
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
    socket.emit('Message', message)
    document.getElementById('Message').value = ''
    }
    else false
})

//Room Join
socket.emit('Join',Query)

//User Join or Left
socket.emit('Bot',Query)

//Showing Message From Server
socket.on('Users-Message',data=>{
    createUsersMessage(data)
    scrollDown.scrollTop = scrollDown.scrollHeight
})

socket.on('Your-Message',data=>{
    createYourMessage(data)
    scrollDown.scrollTop = scrollDown.scrollHeight
})

//Members Info
const memberList = document.getElementById('member-list')

socket.on('Pass-Array',membersdata=>{
    const mapMembers = membersdata.map(user=>`<li>${user.username}</li>`)
    memberList.innerHTML = mapMembers.join('<hr/>')
})

//Emojis
const div = document.getElementById('emoji-container')
function stickerMenu(){
    if(div.style.display === 'block'){
        div.style.display = 'none'
    }
    else div.style.display = 'block'
}

function emoji(emoji){
    const textarea = document.getElementById('Message').value
    document.getElementById('Message').value = textarea + emoji
}