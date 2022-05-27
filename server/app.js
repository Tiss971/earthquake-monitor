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
const swaggerDocument = require("./docs/swagger.json")
app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, { explorer: true })
)

/* EXPRESS CONFIG */
// Use modules and folders
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const cors = require("cors")
app.use(
    cors({
        origin: process.env.CLIENT_HOME,
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
)

/* SESSIONS */
const client = mongoose
    .connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(
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
const sessionMiddleware = session({
    secret: "cpywbzgBn7CR94gRViRo",
    store: MongoStore.create({ client }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
        secure: process.env.NODE_ENV === "production", // must be true if sameSite='none'
      }
})
app.use(sessionMiddleware)
app.use(passport.initialize()) // initialize passport
app.use(passport.session()) // calls the deserializeUser
app.enable("trust proxy") // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

/* ROUTES */
app.use("/auth", authRouter)
app.use("/user", userRouter)
app.use("/earthquake", earthquakeRouter)

/* CHAT WEBSOCKET */
// Create a new instance of socket.io
const { Server } = require("socket.io")
const server = http.createServer(app)

const io = new Server(server)

// convert a connect middleware to a Socket.IO middleware
const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next)
io.use(wrap(sessionMiddleware))
io.use(wrap(passport.initialize()))
io.use(wrap(passport.session()))

io.use((socket, next) => {
    if (socket.request.user) {
        next()
    } else {
        next(new Error("unauthorized"))
    }
})

const OnlineUser = require("./database/models/onlineUsers")
// Websocket handling imports
const registerChatHandlers = require("./controllers/ws/chatHandler")
io.on("connect", (socket) => {
    console.log("New User Logged In with ID " + socket.id)
    // Set user online
    console.log(socket.request.user.username, socket.id)
    OnlineUser.findOneAndUpdate(
        { userId: socket.request.user._id },
        {
            $set: {
                userId: socket.request.user._id,
                socketId: socket.id,
                name: socket.request.user.username,
            },
        },
        { new: true, upsert: true },
        (err, doc) => {
            if (err) {
                console.log(err)
            } else console.log(doc.name + " is now online")
        }
    )

    const session = socket.request.session
    //console.log(`saving sid ${socket.id} in session ${session.id}`);
    session.socketId = socket.id
    session.save()

    registerChatHandlers(io, socket)
})

module.exports = { io, app, server }
