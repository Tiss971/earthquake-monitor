import { useState, useEffect, Fragment } from "react"

import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Drawer from "@mui/material/Drawer"
import Divider from "@mui/material/Divider"
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Icon from '@mui/material/Icon';
import Grid from "@mui/material/Grid"
import List from "@mui/material/List"
import ListItemText from "@mui/material/ListItemText"
import ListItemButton from "@mui/material/ListItemButton"
import MenuItem from '@mui/material/MenuItem';
import Paper from "@mui/material/Paper"
import Select from '@mui/material/Select';
import Typography from "@mui/material/Typography"

import EarthquakeService from "../services/earthquakeService"

import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

const getFormattedDateTime = (date) => {
    const dateObj = new Date(date)
    return dateObj.toLocaleString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false
        })
        
}


export default function Latest() {
    const [open ,setOpen] = useState(false);
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
    const handleEarthquakeClick = (index) => {
        setSelectedIndex(index);
        setOpen(true);
    }


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await EarthquakeService.getLatest(magnitude,time)
            .then((response) => {
                setSummary(response)
            })
            setLoading(false);
        }
        fetchData()   
        const interval=setInterval(()=>{
            fetchData()
           },60000)
        return()=>clearInterval(interval) 
    }, [time,magnitude]);

    useEffect(() => {
        const L = require("leaflet");
    
        delete L.Icon.Default.prototype._getIconUrl;
    
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
          iconUrl: require("leaflet/dist/images/marker-icon.png"),
          shadowUrl: require("leaflet/dist/images/marker-shadow.png")
        });
      }, []);

    return (
        <Grid container sx={{height: 'calc(100vh - 80px)'}} spacing={2}>
            {/* List of earthquakes*/}
            <Grid container item 
                xs={3} sm={3} md={2} sx={{height: 'calc(100vh - 80px)'}}
            >
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
                {loading  
                ?<Grid item xs><CircularProgress /></Grid>
                :summary && <Fragment>
                    <Grid item xs={12}>
                        <Paper sx={{backgroundColor:"primary.main", py:1}}>
                            {summary.metadata.count || 0} earthquakes
                        </Paper>
                    </Grid>
                    <Grid item xs  
                        sx={{
                            maxHeight: 'calc(100% - 112px)', 
                            overflow: 'auto', 
                            flex:'0 0 auto!important'
                        }}
                    >
                        <Paper>
                            <List component="nav">
                                {summary.features.map((item,index) => (
                                    <ListItemButton
                                        key={index}
                                        selected={selectedIndex === index}
                                        onClick={() => handleEarthquakeClick(index)}
                                    >
                                        <ListItemText primary={item.properties.title}/>
                                    </ListItemButton>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                </Fragment>}
            </Grid>
            {/* Map of earthquakes*/}
            <Grid item xs sx={{height: 'calc(100vh - 64px)'}}>
                <MapContainer center={[51.505, -0.09]} zoom={1} scrollWheelZoom={false} 
                    style={{ height: '100%'}}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {summary?.features.length  && summary.features.map((item,index) => (
                        <Marker 
                            key={'marker ' + index} 
                            position={[item.geometry.coordinates[1], item.geometry.coordinates[0]]} 
                            eventHandlers={{click: () => {
                                handleEarthquakeClick(index)
                            }}}
                            sx={{
                                border: index === selectedIndex ? '2px solid red' : '',
                            }}
                        >
                            <Tooltip>{item.properties.title}</Tooltip>
                    
                        </Marker>
                    ))}
                    
                </MapContainer>
            </Grid>
            <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
            >
                <Grid container direction='column' wrap="nowrap" sx={{
                    p:2,
                    minHeight: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    overflow: 'auto',
                    maxWidth:'500px'
                }}>
                    {/* Earthquake details*/}
                    <Grid container direction='column' spacing={1}>
                        <Grid item >
                            <Paper sx={{backgroundColor:"secondary.main",p:2}}>
                                <Typography variant="h4" color="black">
                                    <Icon
                                        sx={{color:'black',mr:2}}
                                        baseClassName="fas" 
                                        className="fa-circle-info"
                                    />
                                    Details
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item sx={{display:'flex', flexDirection:'column'}}>
                            <Typography variant="h6">
                            <strong>Title : </strong> 
                            {summary?.features[selectedIndex].properties.title}
                            </Typography>
                            <Typography variant="h6">
                            <strong>Location : </strong> 
                            {summary?.features[selectedIndex].properties.place}
                            </Typography>
                            <Typography variant="h6">
                                <strong>Date & Time : </strong> 
                                { getFormattedDateTime(summary?.features[selectedIndex].properties.time)}
                            </Typography>
                            <Typography variant="h6">
                                <strong>Latitude : </strong> 
                                {summary?.features[selectedIndex].geometry.coordinates[0]}
                            </Typography>
                            <Typography variant="h6">
                                <strong>Longitude : </strong> 
                                {summary?.features[selectedIndex].geometry.coordinates[1]}
                            </Typography>
                            <Typography variant="h6">
                                <strong>Depth : </strong> 
                                TODO
                            </Typography>
                            <Typography variant="h6">
                                <strong>Magnitude : </strong> 
                                {summary?.features[selectedIndex].properties.mag}
                            </Typography>
                            <Button
                                sx={{margin:'0 auto'}}
                                variant="contained" 
                                target="_blank"
                                href={`https://earthquake.usgs.gov/earthquakes/eventpage/${summary?.features[selectedIndex].id}`}
                            >
                                View earthquake page
                            </Button>
                        </Grid>
                    </Grid>
                    {/* Link to DYFI*/}
                    <Divider></Divider>
                    <Grid container direction='column' spacing={1}>
                        <Grid item>
                            <Paper sx={{backgroundColor:"secondary.main",p:2}}>
                                <Typography variant="h4" color="black">
                                    <Icon   
                                        sx={{color:'black',mr:2}}
                                        baseClassName="fas" 
                                        className="fa-link"
                                    />
                                    Did You Feel It ?
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item>
                            <Button fullWidth
                                variant="contained" 
                                target="_blank"
                                href={`https://earthquake.usgs.gov/earthquakes/eventpage/${summary?.features[selectedIndex].id}/tellus`}
                            >
                                Report
                            </Button>
                        </Grid>
                    </Grid>
                    {/* Nearest Users*/}
                    <Divider></Divider>
                    <Grid container direction='column' spacing={1}>
                        <Grid item>
                            <Paper sx={{backgroundColor:"secondary.main",p:2}}>
                                <Typography variant="h4" color="black">
                                    <Icon   
                                        sx={{color:'black',mr:2}}
                                        baseClassName="fas" 
                                        className="fa-user-group"
                                    />
                                    Nearest Users
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" disabled>
                                
                                TODO
                              
                            </Button>
                           
                        </Grid>
                    </Grid>
                </Grid>
            </Drawer>
           
        </Grid>
    )
}
