import {Outlet} from "react-router-dom"
import ListUsers from "../components/chat/listUsers"
import Grid from '@mui/material/Grid'

export default function Messages(props) {
    return (
      <Grid container spacing={2} sx={{height: 'calc(100vh - 64px)'}}>
        <Grid item xs={5} md={3}>
            <ListUsers user={props.user}/>
        </Grid>
        <Grid item xs={7} md={9} >
          {props.user && <Outlet />}
        </Grid>
      </Grid>
    )
}
