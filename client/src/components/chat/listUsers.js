import React, { useEffect, useState, useContext } from "react"

import { useNavigate } from "react-router"

import Avatar from "@mui/material/Avatar"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import ListItemButton from "@mui/material/ListItemButton"
import Typography from "@mui/material/Typography"

import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import CircularProgress from "@mui/material/CircularProgress"

import userService from "services/userService"
import { SocketContext } from "App"
import { UserContext } from "App"

import { DateToHoursAndMinutes } from "../../utils/date"

export default function ListUsers(props) {
    const { socketService } = useContext(SocketContext)
    const { user } = useContext(UserContext)
    let navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [onlineUsers, setOnlineUsers] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(0)

    // SearchBar
    const [open, setOpen] = useState(false)
    const loading = open && users.length === 0
    useEffect(() => {
        if (!loading) {
            return undefined
        }

        userService.getAll().then((users) => {
            setUsers(users)
        })
    }, [loading])

    // Select list
    const handleListItemClick = (event, index, userId) => {
        navigate(`/chat/${userId}`)
        setSelectedIndex(index)
    }
    const handleSearch = (user) => {
        if (user) navigate(`/chat/${user._id}`)
    }

    // Get users
    useEffect(() => {
        // Get users
        socketService.getOldCorrespondent((err, data) => {
            // TODO: Fix bug don't show the conv if the user hasn't respond
            const users = data.users.filter(
                (correspondent) => correspondent.from !== user._id
            )
            setOnlineUsers(users)
        })
        userService.getAll().then((users) => {
            setUsers(users)
        })
    }, [])

    return (
        <Grid container wrap="nowrap" direction="column" height="100%">
            {/* SearchBar */}
            <Grid item>
                <Autocomplete
                    sx={{ m: 1 }}
                    open={open}
                    clearOnEscape
                    freeSolo
                    onOpen={() => {
                        setOpen(true)
                    }}
                    onClose={() => {
                        setOpen(false)
                    }}
                    onChange={(e, value) => handleSearch(value)}
                    isOptionEqualToValue={(option, value) =>
                        option.username === value.username
                    }
                    getOptionLabel={(option) => option.username}
                    options={users}
                    loading={loading}
                    renderOption={(props, user) => {
                        return (
                            <li {...props} key={user._id}>
                                {user.username}
                            </li>
                        )
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search among all users"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {loading ? (
                                            <CircularProgress
                                                color="inherit"
                                                size={20}
                                            />
                                        ) : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                        />
                    )}
                />
            </Grid>

            {/* Select list */}
            <Grid item xs>
                <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                    {onlineUsers?.map((user, index) => (
                        <React.Fragment key={index + "-" + user._id}>
                            <ListItem alignItems="flex-start">
                                <ListItemButton
                                    sx={{ maxHeight: "100px", width: "100%" }}
                                    selected={selectedIndex === index}
                                    onClick={(event) =>
                                        handleListItemClick(
                                            event,
                                            index,
                                            user.userId
                                        )
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            alt={user.username}
                                            src={
                                                user.image ||
                                                "/static/images/avatar/1.jpg"
                                            }
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="h6"
                                                color="textPrimary"
                                                gutterBottom
                                            >
                                                {user.username}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    textOverflow: "ellipsis",
                                                    overflow: "hidden",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {user.message} -{" "}
                                                {DateToHoursAndMinutes(
                                                    user.timestamp
                                                )}
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                    ))}
                </List>
            </Grid>
        </Grid>
    )
}
