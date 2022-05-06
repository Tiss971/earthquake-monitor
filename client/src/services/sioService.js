import { io } from "socket.io-client"
let socket
let apiURL = process.env.REACT_APP_API_ENDPOINT

export const initSocket = (user) => {
    socket = io(apiURL, {
        auth: {
            user
        },
    })
}

export const disconnectSocket = () => {
    if (socket) socket.disconnect()
}

// Handle message receive event
export const subscribeToMessages = (cb) => {
    if (!socket) return true
    socket.on("chat:message", (msg) => {
        return cb(null, msg)
    })
    socket.on("otherConnect", (msg) => {
        return cb(null, msg)
    })
    socket.on("otherDisconnect", (msg) => {
        return cb(null, msg)
    })
}

export const sendMessage = ({ message }, cb) => {
    if (socket) socket.emit("chat:send", message, cb)
}

export const joinRoom = (roomName, cb) => {
    if (socket) socket.emit("join", roomName, cb)
}

export const leaveRoom = (roomName, cb) => {
    if (socket) socket.emit("leave", roomName, cb)
}

export const getUsers = (cb) => {
    if (!socket) return true
    socket.on("users", (users) => {
        var userList = users.filter((user) => user.userID !== socket.auth.user._id)
        userList = userList.users = users.sort((a, b) => {
          if (a.username < b.username) return -1;
          return a.username > b.username ? 1 : 0;
        });
        return cb(null, userList)
      });
}