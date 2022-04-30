import React from "react"

import Grid from "@mui/material/Grid"
import Alert from "@mui/material/Alert"

function SystemMessage(props) {
    const { type, message } = props
    return (
        <Grid container item justifyContent="center" sx={{ my: "4px" }}>
            <Grid item xs={8}>
                <Alert variant="outlined" severity={type}>
                    {message}
                </Alert>
            </Grid>
        </Grid>
    )
}

export default SystemMessage
