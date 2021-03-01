const usersList = []
function getUser(id,username,room){
    const user = {id, username, room}

    usersList.push(user)

    return user
}

function currentUser(id){return usersList.find(user=>user.id===id)}

function userLeave(id){
    const index = usersList.findIndex(user=>user.id===id)
    if(index !== -1) {
        return usersList.splice(index,1)[0]}
}

function getRoom(room){
    return usersList.filter(user=>user.room===room)
}

module.exports = {
    getUser,
    currentUser,
    userLeave,
    getRoom
}