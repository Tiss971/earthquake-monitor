const express = require("express")
const app = express()
const http = require("http")
const path = require("path")

const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")

const mongoose = require("mongoose")
const MongoStore = require("connect-mongo")
const session = require("express-session")
const passport = require("./passport")

// Import routes
const authRouter = require("./routes/auth")
const userRouter = require("./routes/user")
const earthquakeRouter = require("./routes/earthquake")

/* API DOCS */
const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require('./docs/swagger.json');
app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, { explorer: true})
);

/* EXPRESS CONFIG */
// Use modules and folders
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

/* SESSIONS */
const client = mongoose.connect(process.env.DB_URI,{ useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => {
        console.log("=== Connecting to Mongo ===")
        clientPromise = new Promise(function (resolve, reject) {
            resolve(mongoose.connection.getClient())
            reject(new Error("MongoClient Error"))
        })
        return clientPromise
    },
    (err) => {
        console.log("error connecting to Mongo: ")
        console.log(err)
    }
)
const sessionMiddleware =  session({
    secret: "randomString",
    store: MongoStore.create({ client }),
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false
    }
})
app.use(sessionMiddleware)

/* PASSPORT & MIDDLEWARE*/
//const auth = require('./middleware/auth.js')()
//app.use(auth.initialize());

app.use(passport.initialize()) // initialize passport
app.use(passport.session()) // calls the deserializeUser

const cors = require("cors")
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}))

/* ROUTES */
app.use("/auth", authRouter)
app.use("/user", userRouter)
app.use("/earthquake", earthquakeRouter)





/* CHAT WEBSOCKET */
// Create a new instance of socket.io
const { Server } = require("socket.io")
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
})

// Websocket handling imports
const registerChatHandlers = require("./controllers/ws/chatHandler")
const onConnection = (socket) => {
    socket.user = socket.handshake.auth.user
    // Store user on websocket
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
        users.push({
            socketID: id,
            userID: socket.user._id,
            username: socket.user.username,
        });
    }
    socket.emit("users", users);

    // Join common room
    //socket.join("main")

    console.log(socket.user.username + " connected")
    socket
        .to("main")
        .emit("otherConnect", { name: socket.user.username, systemMsg: "connection" })

    socket.on("disconnect", () => {
        console.log(socket.user.username + " disconnected")
        socket.to("main").emit("otherDisconnect", {
            name: socket.user.name,
            systemMsg: "disconnection",
        })
    })

    // Register handlers here
    registerChatHandlers(io, socket)
}
io.on("connection", onConnection)
// Verify JWT token
io.use((socket,next) => sessionMiddleware(socket.request, {}, next));

module.exports = { io, app, server }
