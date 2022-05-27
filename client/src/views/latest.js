import { useState, useEffect, useContext, Fragment } from "react"

import { UserContext } from "App"

import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Drawer from "@mui/material/Drawer"
import InputLabel from "@mui/material/InputLabel"
import FormControl from "@mui/material/FormControl"
import Icon from "@mui/material/Icon"
import Grid from "@mui/material/Grid"
import List from "@mui/material/List"
import ListItemText from "@mui/material/ListItemText"
import ListItemButton from "@mui/material/ListItemButton"
import MenuItem from "@mui/material/MenuItem"
import Paper from "@mui/material/Paper"
import Select from "@mui/material/Select"
import Skeleton from "@mui/material/Skeleton"
import Slider from "@mui/material/Slider"
import Typography from "@mui/material/Typography"

import { Link } from "react-router-dom"

import EarthquakeService from "../services/earthquakeService"

import { geosearch, arcgisOnlineProvider } from "esri-leaflet-geocoder"
import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css"
import "../css/App.css"
import {
    MapContainer,
    LayersControl,
    TileLayer,
    Marker,
    Tooltip,
    useMap,
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
const selectedIcon = new L.Icon({
    iconUrl: require("../svg/marker-icon-red.png"),
    iconRetinaUrl: require("../svg/marker-icon-red-2x.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
})
const defaultIcon = new L.icon({
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
})

function Control() {
    const mapInstance = useMap()
    //Initialize map
    useEffect(() => {
        // Fix marker bug
        const L = require("leaflet")
        delete L.Icon.Default.prototype._getIconUrl
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
            iconUrl: require("leaflet/dist/images/marker-icon.png"),
            shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
        })

        if (!mapInstance) return
        // Set map center
        mapInstance.locate({ setView: true, maxZoom: 10 })

        // Set control

        const control = geosearch({
            providers: [
                arcgisOnlineProvider({
                    // API Key to be passed to the ArcGIS Online Geocoding Service
                    apikey: process.env.REACT_APP_ARCGIS_API_KEY,
                }),
            ],
        })
        control.addTo(mapInstance)
        control.on("results", handleOnSearchResuts)

        return () => {
            control.off("results", handleOnSearchResuts)
        }
    }, [mapInstance])
    function handleOnSearchResuts(data) {
        console.log("Search results", data)
    }
}

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
        hour12: false,
    })
}

export default function Latest() {
    const { user } = useContext(UserContext)
    const [map, setMap] = useState(null)
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [summary, setSummary] = useState(null)
    const [earthquakes, setEarthquakes] = useState([])
    const [time, setTime] = useState("day")
    const [magnitude, setMagnitude] = useState("2.5")
    const [maxDepth, setMaxDepth] = useState(null)
    const [selectedIndex, setSelectedIndex] = useState(1)
    const [nearestUsers, setNearestUsers] = useState([])

    const handleTime = (event) => {
        setTime(event.target.value)
    }
    const handleMagnitude = (event) => {
        setMagnitude(event.target.value)
    }
    const handleEarthquakeClick = async (index) => {
        setSelectedIndex(index)
        setOpen(true)
        await EarthquakeService.getNearestUsers(
            summary?.features[selectedIndex]?.geometry.coordinates[0],
            summary?.features[selectedIndex]?.geometry.coordinates[1]
        ).then((res) => {
            setNearestUsers(res)
        })
    }
    const handleItemListClick = (item, index) => {
        setSelectedIndex(index)
        map.flyTo([item.geometry.coordinates[1], item.geometry.coordinates[0]], 3)
    }

    const handleSliderDepthChange = (event, newValue) => {
        setMaxDepth(newValue)
    }

    const filterSummary = async () => {
        console.log("Filter summary ", maxDepth)
        if (maxDepth) {
            const newSummaryFeatures = await summary.features.filter((item) => {
                if (item.properties.gap > maxDepth) {
                    return false
                }
                return true
            })
            setEarthquakes(newSummaryFeatures)   
        }else{
            setEarthquakes(summary.features)
        }
        setLoading(false)   
    }
    useEffect(() => {
        if (summary){
            setLoading(true)
            filterSummary()
        }
    }, [summary])

    // Fetch latest earthquake
    useEffect(() => {
        setSelectedIndex(1)
        const fetchData = async () => {
            setLoading(true)
            await EarthquakeService.getLatest(time, magnitude).then((response) => {
                setSummary(response)
            })
            setLoading(false)
        }
        fetchData()
        
        const interval = setInterval(() => {
            fetchData()
        }, 60000)
        return () => clearInterval(interval)
    }, [time, magnitude])

    return (
        <Grid container sx={{ height: "calc(100vh - 80px)" }} spacing={2}>
            {/* List of earthquakes*/}
            <Grid
                container
                direction="column"
                item
                wrap="nowrap"
                xs={3}
                sm={3}
                md={2}
                sx={{ height: "calc(100vh - 80px)" }}
            >
                <Grid item container>
                    <Grid item xs={12} sm={12} md={6}>
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
                    <Grid item xs={12} sm={12} md={6}>
                        <FormControl fullWidth variant="filled">
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
                                <MenuItem value={"significant"}>
                                    Significant
                                </MenuItem>
                                <MenuItem value={"4.5"}>More than 4.5</MenuItem>
                                <MenuItem value={"2.5"}>More than 2.5</MenuItem>
                                <MenuItem value={"1.0"}>More than 1</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <Paper sx={{p:1, opacity: user ? 1 : 0.5}} variant={ user ? 'elevation': 'outlined'}>
                            <Typography variant="body2" align="left" sx={{p:1}}>Maximum Depth</Typography>
                            <Slider
                                disabled={!user}
                                onChange={handleSliderDepthChange}
                                onChangeCommitted={() => {
                                    setLoading(true)
                                    filterSummary()
                                }}
                                aria-label="maxDepth"
                                value={typeof maxDepth === "number" ? maxDepth : 10}
                                valueLabelDisplay="auto"
                                min={0}
                                max={800}
                            />
                            {!user && 
                            <Typography variant="body2" gutterBottom>
                                You need to be logged to use this filter
                            </Typography>
                            }
                        </Paper>
                    </Grid>
                </Grid>
                {loading ? (
                    <Grid item>
                        <CircularProgress />
                    </Grid>
                ) : (
                    summary &&
                    earthquakes && (
                        <Fragment>
                            <Grid item>
                                <Paper
                                    sx={{ backgroundColor: "primary.main", py: 1 }}
                                >
                                    {earthquakes.length || 0} earthquakes
                                </Paper>
                            </Grid>
                            <Grid item sx={{ overflow: "auto" }}>
                                <Paper>
                                    <List component="nav">
                                        {earthquakes?.map((item, index) => (
                                            <ListItemButton
                                                key={index}
                                                selected={selectedIndex === index}
                                                onClick={() =>
                                                    handleItemListClick(item, index)
                                                }
                                            >
                                                <ListItemText
                                                    primary={item.properties.title}
                                                />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Paper>
                            </Grid>
                        </Fragment>
                    )
                )}
            </Grid>
            {/* Map of earthquakes*/}
            <Grid item xs sx={{ height: "calc(100vh - 64px)" }}>
                <MapContainer
                    ref={setMap}
                    center={{ lat: 48.856614, lng: 2.3522219 }}
                    zoom={6}
                    style={{ height: "100%" }}
                >
                    <LayersControl>
                        <LayersControl.BaseLayer checked name="Default">
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="NASA Gibs Blue Marble">
                            <TileLayer
                                url="https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg"
                                attribution="&copy; NASA Blue Marble, image service by OpenGeo"
                                maxNativeZoom={8}
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>
                    {summary?.features?.length &&
                        earthquakes?.map((item, index) => (
                            <Marker
                                icon={
                                    selectedIndex === index
                                        ? selectedIcon
                                        : defaultIcon
                                }
                                key={"marker " + index}
                                position={[
                                    item.geometry.coordinates[1],
                                    item.geometry.coordinates[0],
                                ]}
                                eventHandlers={{
                                    click: () => {
                                        handleEarthquakeClick(index)
                                    },
                                }}
                                sx={{
                                    border:
                                        index === selectedIndex
                                            ? "2px solid red"
                                            : "",
                                }}
                            >
                                <Tooltip>{item.properties.title}</Tooltip>
                            </Marker>
                        ))}
                    <Control />
                </MapContainer>
            </Grid>
            {/* Selected Earthquake Details*/}
            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                {summary && earthquakes && earthquakes[selectedIndex] && (
                    <Fragment>
                        <Grid
                            container
                            direction="column"
                            wrap="nowrap"
                            spacing={3}
                            sx={{
                                p: 2,
                                justifyContent: "space-between",
                                alignItems: "stretch",
                                maxWidth: "500px",
                            }}
                        >
                            {/* Earthquake details*/}
                            <Grid container item direction="column" spacing={1}>
                                <Grid item>
                                    <Paper
                                        sx={{
                                            backgroundColor: "secondary.main",
                                            p: 2,
                                        }}
                                    >
                                        <Typography variant="h4" color="black">
                                            <Icon
                                                sx={{ color: "black", mr: 2 }}
                                                baseClassName="fas"
                                                className="fa-circle-info"
                                            />
                                            Details
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid
                                    item
                                    sx={{ display: "flex", flexDirection: "column" }}
                                >
                                    <Typography variant="h6">
                                        <strong>Title : </strong>
                                        {
                                            summary?.features[selectedIndex]
                                                ?.properties.title
                                        }
                                    </Typography>
                                    <Typography variant="h6">
                                        <strong>Location : </strong>
                                        {
                                            summary?.features[selectedIndex]
                                                ?.properties.place
                                        }
                                    </Typography>
                                    <Typography variant="h6">
                                        <strong>Date & Time : </strong>
                                        {getFormattedDateTime(
                                            summary?.features[selectedIndex]
                                                ?.properties.time
                                        )}
                                    </Typography>
                                    <Typography variant="h6">
                                        <strong>Latitude : </strong>
                                        {
                                            summary?.features[selectedIndex]
                                                ?.geometry.coordinates[0]
                                        }
                                    </Typography>
                                    <Typography variant="h6">
                                        <strong>Longitude : </strong>
                                        {
                                            summary?.features[selectedIndex]
                                                ?.geometry.coordinates[1]
                                        }
                                    </Typography>
                                    <Typography variant="h6">
                                        <strong>Depth : </strong>
                                        {`${summary?.features[selectedIndex]?.geometry.coordinates[2]} km`}
                                    </Typography>
                                    <Typography variant="h6">
                                        <strong>Magnitude : </strong>
                                        {
                                            summary?.features[selectedIndex]
                                                ?.properties.mag
                                        }
                                    </Typography>
                                    <Button
                                        sx={{ margin: "0 auto" }}
                                        variant="contained"
                                        target="_blank"
                                        href={`https://earthquake.usgs.gov/earthquakes/eventpage/${summary?.features[selectedIndex]?.id}`}
                                    >
                                        View earthquake page
                                    </Button>
                                </Grid>
                            </Grid>
                            {/* Link to DYFI*/}
                            <Grid container item direction="column" spacing={1}>
                                <Grid item>
                                    <Paper
                                        sx={{
                                            backgroundColor: "secondary.main",
                                            p: 2,
                                        }}
                                    >
                                        <Typography variant="h4" color="black">
                                            <Icon
                                                sx={{ color: "black", mr: 2 }}
                                                baseClassName="fas"
                                                className="fa-link"
                                            />
                                            Did You Feel It ?
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        target="_blank"
                                        href={`https://earthquake.usgs.gov/earthquakes/eventpage/${summary?.features[selectedIndex]?.id}/tellus`}
                                    >
                                        Report
                                    </Button>
                                </Grid>
                            </Grid>
                            {/* Nearest Users*/}
                            <Grid container item direction="column" spacing={1}>
                                <Grid item>
                                    <Paper
                                        sx={{
                                            backgroundColor: "secondary.main",
                                            p: 2,
                                        }}
                                    >
                                        <Typography variant="h4" color="black">
                                            <Icon
                                                sx={{ color: "black", mr: 2 }}
                                                baseClassName="fas"
                                                className="fa-user-group"
                                            />
                                            Nearest Users
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item container sx={{ overflow: "auto" }}>
                                    {user ? (
                                        nearestUsers.length ? (
                                            nearestUsers.map((user, index) => (
                                                <Grid
                                                    item
                                                    container
                                                    key={"nearestUser " + index}
                                                >
                                                    <Grid item xs={2}>
                                                        <Avatar
                                                            src={user.image}
                                                            sx={{
                                                                width: "50px",
                                                                height: "50px",
                                                                display: "block",
                                                                overflow: "hidden",
                                                                border: "2px solid white",
                                                                boxShadow:
                                                                    "0px 0px 10px rgba(0,0,0,0.5)",
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={7}>
                                                        <Typography variant="body">
                                                            {user.username}
                                                        </Typography>
                                                        <br></br>
                                                        <Typography variant="caption">
                                                            Last Connexion :
                                                            {getFormattedDateTime(
                                                                user.lastVisit
                                                            )}
                                                        </Typography>
                                                        <br></br>
                                                        <Typography variant="caption">
                                                            Address : {user.address}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Button variant="contained">
                                                            <Icon
                                                                sx={{
                                                                    color: "black",
                                                                    mr: 2,
                                                                }}
                                                                baseClassName="fas"
                                                                className="fa-link"
                                                            />
                                                            <Link
                                                                to={`/chat/${user._id}`}
                                                            >
                                                                Chat
                                                            </Link>
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            ))
                                        ) : (
                                            <Grid item>
                                                <Typography variant="h6">
                                                    No users found
                                                </Typography>
                                            </Grid>
                                        )
                                    ) : (
                                        <Grid item xs={12}>
                                            <Typography variant="h6">
                                                Reserved to log users
                                            </Typography>
                                            <Typography variant="h3">
                                                <Skeleton animation="wave" />
                                                <Skeleton animation="wave" />
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Fragment>
                )}
            </Drawer>
        </Grid>
    )
}
