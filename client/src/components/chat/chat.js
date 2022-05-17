import { useEffect, useState, useContext } from "react"
import { UserContext } from "App"
import { useParams } from "react-router-dom";
import {
    disconnectSocket,
    subscribeToMessages,
    sendMessage,
} from "services/sioService"

import {useTheme} from '@mui/material/styles';

import UserMessage from "./UserMessage"

import Avatar from "@mui/material/Avatar"
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
    const mySelf = useContext(UserContext);

    const [toUser, setToUser] = useState(null)
    const [chatMessage, setChatMessage] = useState([])
    const [messages, setMessages] = useState([])

    useEffect(() => {
        async function fetchData() {
            await userService.getUserById(params.userID).then(user => {
                setToUser(user)
            })
        }
        fetchData()
        subscribeToMessages((err, data) => {
            setMessages((prev) => [...prev, data])
        })
        // Cleanup when user disconnects
        return () => {
            disconnectSocket()
        }
    }, [params])

    /* SEND MESSAGE*/
    const submitMessage = (e) => {
        e.preventDefault()
        const message = chatMessage.trim()
        if (message.length === 0 || !message) return
        sendMessage({ message, toId: toUser._id }, (cb) => {
            if (cb.status === "ok") {
                setChatMessage("")
            }
            else{
                // TODO: handle error status === 'error' ; msg = message to display
                console.log(cb)
            }
        })
    }
    const inputChange = (e) => {
        e.preventDefault()
        setChatMessage(e.target.value)
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
                rowSpacing={1}
                sx={{overflowY:"auto"}}
            >
                {messages.map((item, k) => (  
                    <UserMessage
                        key={k}
                        avatar={item.from === mySelf._id ? mySelf.image : toUser.image}
                        side={item.from === mySelf._id ? "right" : "left"}
                        sender={item.from === mySelf._id ? mySelf.username : toUser.username}
                        message={item.message}
                        time={DateToHoursAndMinutes(item.time)}
                    /> 
                ))}                    
            </Grid>
            {/* Input */}
            <form onSubmit={submitMessage}>
            <Grid item container >
            
                <Grid item xs={8}>
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
