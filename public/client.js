const socket = io()
const sendMessage = document.getElementById('submit')
const scrollDown = document.getElementById('message-container')

//Getting Name From Query
const username = Qs.parse(location.search,{
    ignoreQueryPrefix : true
})

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
    console.log(obj);
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
    socket.emit('Message',username , message)
    document.getElementById('Message').value = ''
    }
    else false
})

//User Join or Left
socket.emit('Bot',username)

//Showing Message From Server
socket.on('Users-Message',data=>{
    createUsersMessage(data)
    scrollDown.scrollTop = scrollDown.scrollHeight
})

socket.on('Your-Message',data=>{
    createYourMessage(data)
    scrollDown.scrollTop = scrollDown.scrollHeight
})

//Add To Members
const memberList = document.getElementById('member-list')

socket.emit('Add-Member',username)
socket.on('Pass-Array-Add',membersdata=>{
    const mapMembers = membersdata.map(user=>`<li>${user}</li>`)
    memberList.innerHTML = mapMembers.join('<hr/>')
})

//Remove From Members
socket.emit('Remove-Member',username)
socket.on('Pass-Array-Remove',membersdata=>{
    const mapMembers = membersdata.map(user=>`<li>${user}</li>`)
    memberList.innerHTML = mapMembers.join('<hr/>')
})