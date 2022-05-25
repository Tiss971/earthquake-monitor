const OnlineUser = require("../../database/models/onlineUsers")
const Message = require("../../database/models/messages")

module.exports = (io, socket) => {
    socket.on("sendMessage", ({ message, toId }, callback) => {
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
                    msg: "Message can't be saved",
                })
            }
            console.log("message saved")
        })
        // See if user is online
        OnlineUser.findOne({ userId: toId }, (err, user) => {
            if (err) {
                console.log(err)
                callback({
                    status: "error",
                    msg: "User can't be found",
                })
            }
            if (user) {
                // Send message to user
                socket.to(user.socketId).emit("receiveMessage", newMessage)
            } else console.log("User not online")
        })
        // Send to sender for display
        socket.emit("receiveMessage", newMessage)
        callback({
            status: "ok",
        })
    })

    socket.on("getMessages", (data, callback) => {
        //find message by userId with from and to or to and from with pagination
        Message.find({
            $or: [
                { from: socket.request.user._id, to: data.toId },
                { from: data.toId, to: socket.request.user._id },
            ],
        })
            .sort({ timestamp: -1 })
            .skip(data.skip)
            .limit(data.limit)
            .exec((err, messages) => {
                if (err) {
                    console.log(err)
                    callback({
                        status: "error",
                        msg: "Messages can't be found",
                    })
                }
                callback({
                    status: "ok",
                    messages,
                })
            })
    })

    socket.on("getOldCorrespondent", (callback) => {
        //find all distinct to where from is the userId and distinc from where to is the userId in messages
        //order by last message timestamp desc
        //get username and avatar
        Message.aggregate(
            [
                {
                    $match: {
                        $or: [
                            { from: socket.request.user._id },
                            { to: socket.request.user._id },
                        ],
                    },
                },
                {
                    $group: {
                        _id: {
                            to: "$to",
                            from: "$from",
                        },
                        lastMessage: {
                            $last: "$$ROOT",
                        },
                    },
                },
                {
                    $sort: {
                        "lastMessage.timestamp": -1,
                    },
                },
                {
                    $group: {
                        _id: "$_id.from",
                        lastMessage: {
                            $last: "$lastMessage",
                        },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $unwind: "$user",
                },
                {
                    $project: {
                        _id: 0,
                        userId: "$_id",
                        username: "$user.username",
                        image: "$user.image",
                        message: "$lastMessage.message",
                        from: "$lastMessage.from",
                        to: "$lastMessage.to",
                        timestamp: "$lastMessage.timestamp",
                    },
                },
            ],
            (err, users) => {
                if (err) {
                    console.log(err)
                    callback({
                        status: "error",
                        msg: "Users or messages can't be found",
                    })
                }
                callback({
                    status: "ok",
                    users,
                })
            }
        )
    })

    socket.on("disconnect", () => {
        OnlineUser.deleteOne({ socketId: socket.id }, function (err, res) {
            if (err) console.log(err)
            else
                console.log(
                    "User " + socket.request.user.username + " went offline..."
                )
        })
    })
}
