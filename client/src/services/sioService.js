import React from "react"
import { io } from "socket.io-client"
let apiURL = process.env.REACT_APP_API_ENDPOINT

export const socket = io(apiURL,{
        withCredentials: true,
        transports: ['websocket'],
})

const disconnectSocket = () => {
    if (socket) socket.disconnect()
}

const subscribeToMessages = (cb) => {
    if (!socket) return true
    socket.on("receiveMessage", (msg) => {
        return cb(null, msg)
    })
}
const unsubscribeToMessages = () => {
    if (!socket) return true
    socket.off("receiveMessage")
}

const sendMessage = ({ message, toId }, cb) => {
    if (socket) socket.emit("sendMessage", {message, toId}, cb)
}

const getUsers = (cb) => {
    if (!socket) return true
    socket.on("users", (users) => {
        console.log(users)
        var userList = users.filter((user) => user.userID !== socket.auth.user._id)
        userList = userList.users = users.sort((a, b) => {
          if (a.username < b.username) return -1;
          return a.username > b.username ? 1 : 0;
        });
        return cb(null, userList)
      });
}

const getMessages = ({ toId, skip, limit }, cb) => {
    if (!socket) return true
    socket.emit("getMessages", {toId, skip, limit}, (messages) => {
        return cb(null, messages)
    })
}

export const socketService = {
    disconnectSocket,
    subscribeToMessages,
    unsubscribeToMessages,
    sendMessage,
    getUsers,
    getMessages
}