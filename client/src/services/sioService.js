import React from "react"
import { io } from "socket.io-client"
let apiURL = process.env.REACT_APP_API_ENDPOINT

export const SocketContext = React.createContext()

export const socket = io(apiURL,{
        withCredentials: true,
        transports: ['websocket'],
})

export const disconnectSocket = () => {
    if (socket) socket.disconnect()
}

export const subscribeToMessages = (cb) => {
    if (!socket) return true
    socket.on("chat:message", (msg) => {
        return cb(null, msg)
    })
    socket.on("receiveMessage", (msg) => {
        return cb(null, msg)
    })
}

export const sendMessage = ({ message, toId }, cb) => {
    if (socket) socket.emit("sendMessage", {message, toId}, cb)
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
        console.log(users)
        var userList = users.filter((user) => user.userID !== socket.auth.user._id)
        userList = userList.users = users.sort((a, b) => {
          if (a.username < b.username) return -1;
          return a.username > b.username ? 1 : 0;
        });
        return cb(null, userList)
      });
}