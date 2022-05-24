import { useEffect, useState, useContext, useRef} from "react"
import { UserContext } from 'App'
import { SocketContext } from 'App'
import { useParams } from "react-router-dom"


import {useTheme} from '@mui/material/styles'

import UserMessage from "./UserMessage"

import Avatar from "@mui/material/Avatar"
import CircularProgress from "@mui/material/CircularProgress"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Icon from "@mui/material/Icon"

import userService from "services/userService"

const getFormattedDateTime = (date) => {
    const dateObj = new Date(date)
    return dateObj.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false
        })    
}

function DateToHoursAndMinutes(datestring) {
    const date = new Date(datestring)
    return date.toLocaleTimeString().slice(0, 5)
}

function Chat(props) {
    const params = useParams()
    const theme = useTheme()

    const {user} = useContext(UserContext);
    const { socketService } = useContext(SocketContext);

    const [toUser, setToUser] = useState({})
    const toUserRef = useRef(toUser);
    toUserRef.current = toUser;
    const [chatMessage, setChatMessage] = useState([])
    const [messages, setMessages] = useState({})
    const [loadingMessage, setLoadingMessage] = useState(false)

    // Scroll to bottom on new messages
    const messagesBottom = useRef(null)
    useEffect(() => {
        if (!loadingMessage) {
            messagesBottom.current.scrollIntoView({ behavior: "smooth" })    
        }
        setLoadingMessage(false)     
    }, [messages])
    // Init users and listener
    useEffect(() => {
        async function fetchUsers() {
            //TODO: FIX WHEN CHANGING X TIMES USER ID IN URL IT SEND X TIMES THE MESSAGE 
            await userService.getUserById(params.userID).then(user => {
                setToUser(user)
            })
        }
        fetchUsers()
        socketService.subscribeToMessages((err, data) => {
            setMessages((prev) => ({
                ...prev, 
                [toUserRef.current._id] : [...prev[toUserRef.current._id], {from : data.from, to : data.to, message : data.message, timestamp : data.timestamp}]
            }))
        })
        //cleanup
        return () => {
            socketService.unsubscribeToMessages()
        }
    }, [params])

    // Init messages
    useEffect(() => {
        async function fetchMessage() {
            if(!messages[toUser._id] && toUser) {
                setLoadingMessage(true)
                await socketService.getMessages({toId: toUser._id, skip: 0, limit: 20}, (err, data) => {
                    setMessages((prev) => ({
                        ...prev,
                        [toUserRef.current._id] : data.messages.reverse()
                    }))
                })
                setLoadingMessage(false)
            }
        }
        fetchMessage()
    }, [toUser])

    // Send messages
    const submitMessage = (e) => {
        e.preventDefault()
        const message = chatMessage.trim()
        if (message.length === 0 || !message) return
        socketService.sendMessage({ message, toId: toUser?._id }, (cb) => {
            if (cb.status === "ok") {
                setChatMessage("")
            }
            else{
                console.log(cb)
            }
        })
    }
    const inputChange = (e) => {
        e.preventDefault()
        setChatMessage(e.target.value)
    }

    // load more old messages
    const loadMoreMessages = () => {
        setLoadingMessage(true)
        const userMessages = messages[toUser._id]
        if(!userMessages) return
        //const lastMessage = userMessages[userMessages.length - 1]
        socketService.getMessages({toId: toUser._id, skip: userMessages.length, limit: 10}, (err, data) => {
            setMessages((prev) => ({
                ...prev,
                [toUserRef.current._id] : [...data.messages, ...prev[toUserRef.current._id]]
            }))
        })
    }


    return (
        <Grid
            container
            wrap="nowrap"
            direction="column"
            height="100%"
        >   
            <Grid item>
                <Toolbar sx={{backgroundColor: theme.palette.primary.main}}>
                    <Avatar src={toUser?.image} sx={{mr:2}} />
                    <Typography variant="h6"  sx={{mr:2}} >{toUser?.username}</Typography>
                    <Typography variant="caption">Last connexion : {getFormattedDateTime(toUser?.lastVisit)}</Typography>
                </Toolbar>
            </Grid>
            {/* Messages */ }
            <Grid
                container
                xs
                item
                wrap="nowrap"
                direction="column"
                sx={{overflowY:"auto"}}
            >   
                {loadingMessage 
                    ? <><CircularProgress /> Loading...</> 
                    : <Button variant="outlined" onClick={()=>loadMoreMessages()}> Load More </Button>
                }
                
                {messages[toUser?._id]?.map((item, k) => (  
                    <UserMessage
                        key={k}
                        avatar={item.from === user._id ? user.image : toUser.image}
                        side={item.from === user._id ? "right" : "left"}
                        message={item.message}
                        timestamp={DateToHoursAndMinutes(item.timestamp)}
                    /> 
                ))}
                {loadingMessage && <><CircularProgress /> Loading...</>}
                <div ref={messagesBottom} />                  
            </Grid>
            {/* Input */}
            <form onSubmit={submitMessage}>
            <Grid item container >
                <Grid item xs>
                    <TextField
                        autoFocus
                        placeholder="Send a message"
                        variant="outlined"
                        value={chatMessage}
                        fullWidth
                        onChange={inputChange}
                    />
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        type="submit"
                        sx={{height: "100%", width: "100%"}}
                        endIcon={ <Icon   
                            baseClassName="fas" 
                            className="fa-paper-plane"
                        />}
                    >
                        Submit
                    </Button>
                </Grid>
               
            </Grid>
            </form>
        </Grid>
       
    )
}

export default Chat
