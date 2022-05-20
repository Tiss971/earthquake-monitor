const OnlineUser = require("../../database/models/onlineUsers")
const Message = require("../../database/models/messages")

module.exports = (io, socket) => {
    
    socket.on("chat:send", ({ username, message, roomName }, callback) => {
        // generate data to send to receivers
        const outgoingMessage = {
            name: username,
            id: socket.id,
            message,
        }

        // TODO store message in database

        // send socket to all in room except sender
        socket.to(roomName).emit("chat:message", outgoingMessage)
        callback({
            status: "ok",
        })
    })

    socket.on("chat:join", (roomName) => {
        console.log("join: " + roomName)
        socket.leave
        socket.join(roomName)

        const outgoingMessage = {
            name: "SERVER",
            id: "server",
            message: `${socket.id} has joined.`,
        }
        socket.to(roomName).emit("message", outgoingMessage)
    })
    socket.on("sendMessage", ({message, toId}, callback)=> {
        // Save message to database
        const newMessage = {
            message,
            from: socket.request.user.id,
            to: toId,
            timestamp: Date.now(),
        }
        const messageToSave = new Message(newMessage)
        messageToSave.save((err, message) => {
            if (err) {
                console.log(err)
                callback({
                    status: "error",
                    msg : 'Message can\'t be saved'
                })
            }
            console.log("message saved")
        })
        // See if user is online
        OnlineUser.findOne({ userId: toId}, (err, user) => {
            if (err) {
                console.log(err)
                callback({
                    status: "error",
                    msg : 'User can\'t be found'
                })
            }
            if (user) {
                // Send message to user
                socket.to(user.socketId).emit("receiveMessage", newMessage)
            }
            else console.log("User not online")
        })
        // Send to sender for display
        socket.emit("receiveMessage", newMessage)
        callback({
            status: "ok",
        })
    })

    /*

    socket.on('userDetails',(data) => { //checks if a new user has logged in and recieves the established chat details
        mongoClient.connect(database, (err,db) => {
            if(err)
                throw err;
            else {
                var onlineUser = { //forms JSON object for the user details
                    "ID":socket.id,
                    "name":data.fromUser
                };
                var currentCollection = db.db(dbname).collection(chatCollection);
                var online = db.db(dbname).collection(userCollection);
                online.insertOne(onlineUser,(err,res) =>{ //inserts the logged in user to the collection of online users
                    if(err) throw err;
                    console.log(onlineUser.name + " is online...");
                });
                currentCollection.find({ //finds the entire chat history between the two people
                    "from" : { "$in": [data.fromUser, data.toUser] },
                    "to" : { "$in": [data.fromUser, data.toUser] }
                },{projection: {_id:0}}).toArray((err,res) => {
                    if(err)
                        throw err;
                    else {
                        //console.log(res);
                        socket.emit('output',res); //emits the entire chat history to client
                    }
                });
            }
            db.close();
        });   
    });  
    */
    socket.on('disconnect', () => {
        OnlineUser.deleteOne({socketId: socket.id}, function(err, res) { 
            if (err) console.log(err)
            else console.log("User " + socket.request.user.username + " went offline...");
        });
    });
}
