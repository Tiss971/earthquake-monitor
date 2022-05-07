import { useState, useEffect } from "react"

import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Grid from "@mui/material/Grid"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemButton from "@mui/material/ListItemButton"
import MenuItem from '@mui/material/MenuItem';
import Paper from "@mui/material/Paper"
import Select from '@mui/material/Select';



import EarthquakeService from "../services/earthquakeService"


export default function Menu() {
    const [loading ,setLoading] = useState(false);
    const [summary,setSummary] = useState(null);
    const [time, setTime] = useState('week');
    const [magnitude, setMagnitude] = useState('4.5');
    const [selectedIndex, setSelectedIndex] = useState(1);

    const handleTime = (event) => {
        setTime(event.target.value);
    };
    const handleMagnitude= (event) => {
        setMagnitude(event.target.value);
    };
    const handleListItemClick = (event,index) => {
        setSelectedIndex(index);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await EarthquakeService.getLatest(magnitude,time)
            .then((response) => {
                setSummary(response)
                console.log(summary)
            })
            setLoading(false);
        }
        fetchData()   
        const interval=setInterval(()=>{
            fetchData()
           },60000)
        return()=>clearInterval(interval) 
    }, [time,magnitude]);


    return (
        <Grid container 
            sx={{alignContent:'flex-start', height:'calc(100vh - 64px)'}}
        >
            {/* List of earthquakes*/}
            <Grid container item xs={12} sm={4} md={3} >
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="filled">
                        <InputLabel id="time-label">Time</InputLabel>
                        <Select
                        autoWidth
                        labelId="time-label"
                        id="time-input"
                        value={time}
                        onChange={handleTime}
                        label="Time"
                        >
                        <MenuItem value={"hour"}>Past Hour</MenuItem>
                        <MenuItem value={"day"}>Past Day</MenuItem>
                        <MenuItem value={"week"}>Past 7 Days</MenuItem>
                        <MenuItem value={"month"}>Past 30 Days</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth  variant="filled">
                        <InputLabel id="magnitude-label">Magnitude</InputLabel>
                        <Select
                        autoWidth
                        labelId="magnitude-label"
                        id="magnitude-input"
                        value={magnitude}
                        onChange={handleMagnitude}
                        >
                        <MenuItem value="all">
                            <strong>All</strong>
                        </MenuItem>
                        <MenuItem value={"significant"}>Significant</MenuItem>
                        <MenuItem value={"4.5"}>More than 4.5</MenuItem>
                        <MenuItem value={"2.5"}>More than 2.5</MenuItem>
                        <MenuItem value={"1.0"}>More than 1</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs>
                    {loading  
                    ?<CircularProgress />
                    :summary && <div>
                        <Paper sx={{backgroundColor:"primary.main", py:1}}>
                            {summary.metadata.count || 0} earthquakes
                        </Paper>
                        <Paper sx={{maxHeight: '75vh', overflow: 'auto'}}>
                            <List component="nav">
                                {summary.features.map((item,index) => (
                                    <ListItemButton
                                        selected={selectedIndex === index}
                                        onClick={(event) => handleListItemClick(event, index)}
                                    >
                                        <ListItemText primary={item.properties.title}/>
                                    </ListItemButton>
                                ))}
                            </List>
                        </Paper>
                        
                    </div>}
                </Grid>
            </Grid>
            {/* Map of earthquakes*/}
            <Grid item xs>
        
            </Grid>
        </Grid>
    )
}
