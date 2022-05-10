import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom";
import {
    initSocket,
    disconnectSocket,
    subscribeToMessages,
    sendMessage,
    joinRoom,
} from "services/sioService"

import {useTheme} from '@mui/material/styles';

import "css/chat.css"
import UserMessage from "./UserMessage"
import SystemMessage from "./SystemMessage"

import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Icon from "@mui/material/Icon"
import userService from "services/userService"

function DateToHoursAndMinutes(datestring) {
    const date = new Date(datestring)
    return date.toLocaleTimeString().slice(0, 5)
}

function Chat(props) {
    const params = useParams()
    const theme = useTheme()
    const MAIN_CHAT_ROOM = "main"

    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem("token"))
    const [chatMessage, setChatMessage] = useState([])
    const [messages, setMessages] = useState([])
    const [room, setRoom] = useState(MAIN_CHAT_ROOM)

    const roomInputRef = useRef("")

    useEffect(() => {
        async function fetchData() {
            await userService.getUserById(params.userID).then(user => {
                setUser(user)
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
    }, [token,params])

    const submitRoom = (e) => {
        // TODO: add dynamic room support
        e.preventDefault()
        const roomValue = roomInputRef.current.value
        setRoom(roomValue)
        joinRoom(roomValue, (cb) => {
            console.log(cb)
        })
    }

    /* SEND MESSAGE*/
    const submitMessage = (e) => {
        e.preventDefault()
        const message = chatMessage
        if (message) {
            sendMessage({ message, roomName: "main" }, (cb) => {
                // TODO: add dynamic room support
                // clear the input after the message is sent
                setChatMessage("")
                setMessages((prev) => [
                    ...prev,
                    { username: "Me", message: message, self: true },
                ])
            })
        }
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
            className="chat-wrapper"
        >   
            <Grid item xs={12}>
                
                <Toolbar sx={{backgroundColor: theme.palette.primary.main}}>
                    <Typography variant="h6" component="div">
                        {user?.username}
                    </Typography>
                </Toolbar>
                

            </Grid>
            
            <Grid
                container
                wrap="nowrap"
                item
                direction="column"
                rowSpacing={1}
                className="chat-messages"
            >
                {messages.map((item, k) => (
                    <>
                        {item.message ? (
                            <UserMessage
                                avatar={""}
                                side={item.self ? "right" : "left"}
                                sender={item.name}
                                message={item.message}
                                time={DateToHoursAndMinutes(item.time)}
                            />
                        ) : (
                            <>
                                {item.systemMsg === "connection" ? (
                                    <SystemMessage
                                        type="success"
                                        message={
                                            item.name + " has joined the chat"
                                        }
                                    />
                                ) : (
                                    <>
                                        {item.systemMsg === "disconnection" ? (
                                            <SystemMessage
                                                type="error"
                                                message={
                                                    item.name +
                                                    " has left the chat"
                                                }
                                            />
                                        ) : (
                                            <SystemMessage
                                                type="warning"
                                                message={
                                                    item.name + item.systemMsg
                                                }
                                            />
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </>
                ))}
            </Grid>
            <Grid item>
                <form className="chat-input" onSubmit={submitMessage}>
                    <TextField
                        autoFocus
                        placeholder="Send a message"
                        variant="outlined"
                        value={chatMessage}
                        fullWidth
                        onChange={inputChange}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        endIcon={ <Icon   
                            baseClassName="fas" 
                            className="fa-paper-plane-top"
                        />}
                    >
                        Submit
                    </Button>
                </form>
            </Grid>
        </Grid>
       
    )
}

export default Chat
