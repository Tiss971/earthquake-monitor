import React from "react"
import PropTypes from "prop-types"
import cx from "clsx"
import Grid from "@material-ui/core/Grid"
import Avatar from "@material-ui/core/Avatar"
import Typography from "@material-ui/core/Typography"
import withStyles from "@material-ui/core/styles/withStyles"

//Create Style
const defaultChatMsgStyles = ({ palette, spacing }) => {
    const radius = spacing(2.5)
    const size = spacing(4)
    const rightBgColor = palette.primary.main
    // if you want the same as facebook messenger, use this color '#09f'
    return {
        avatar: {
            width: size,
            height: size,
        },
        leftRow: {
            textAlign: "left",
        },
        rightRow: {
            textAlign: "right",
        },
        msg: {
            padding: spacing(1, 2),
            borderRadius: radius,
            display: "inline-block",
            wordBreak: "break-word",
            fontFamily:
                // eslint-disable-next-line max-len
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
            fontSize: "14px",
        },
        left: {
            marginLeft: "8px",
            backgroundColor: palette.grey[100],
        },
        right: {
            marginRight: "8px",
            backgroundColor: rightBgColor,
            color: palette.common.white,
        },
    }
}

const UserMessage = withStyles(defaultChatMsgStyles, { name: "ChatMsg" })(
    (props) => {
        const { classes, avatar, side, sender, message } = props

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
                <Grid item xs={8} className={classes[`${side}Row`]}>
                    <Typography
                        align={side}
                        className={cx(classes.msg, classes[side])}
                    >
                        {side === "left" ? sender + " : " : ""} {message}
                    </Typography>
                </Grid>
            </Grid>
        )
    }
)

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
export default UserMessage
