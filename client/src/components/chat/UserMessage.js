import Grid from "@mui/material/Grid"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"

export default function UserMessage(props) {
    const { avatar, username, message, side, timestamp } = props
    return (
        <Grid
            container
            item
            direction={side === "left" ? "row" : "row-reverse"}
            alignItems="center"
            wrap="nowrap"
        >
            <Grid item>
                <Avatar alt={username} src={avatar || "/static/images/avatar/1.jpg"} sx={{ width: 40, height: 40 }} />
            </Grid>
            <Grid
                item
                sx={{
                    mx: 2,
                    borderRadius: "10px",
                    color: "black",
                    backgroundColor:
                        side === "left" ? "secondary.main" : "accent.main",
                    padding: "10px",
                    margin: "10px",
                    maxWidth: "calc(100% - 20px)",
                    position: "relative",
                }}
            >
                <Typography
                    variant="body"
                    align={side}
                    sx={{ wordBreak: "break-word" }}
                >
                    {message}
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant="caption" align={side} sx={{ color: "white" }}>
                    {timestamp}
                </Typography>
            </Grid>
        </Grid>
    )
}
