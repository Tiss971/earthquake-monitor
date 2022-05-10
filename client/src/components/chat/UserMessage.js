import React from "react"
import PropTypes from "prop-types"
import Grid from "@mui/material/Grid"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"

export default function UserMessage(props) {
    const {avatar, messages, side} = props
    return (
        <Grid
            container
            item
            justify={side === "right" ? "flex-end" : "flex-start"}
        >
            {side === "left" && (
                <Grid item>
                    <Avatar src={avatar} />
                </Grid>
            )}
            <Grid item xs={8}>
                <Typography
                    align={side}
                >
                    {side === "left" ? messages.sender + " : " : ""} {messages}
                </Typography>
            </Grid>
        </Grid>
    )
}
    

UserMessage.propTypes = {
    avatar: PropTypes.string,
    messages: PropTypes.arrayOf(PropTypes.string),
    side: PropTypes.oneOf(["left", "right"]),
}
UserMessage.defaultProps = {
    avatar: "",
    messages: [],
    side: "left",
    time: null,
}
