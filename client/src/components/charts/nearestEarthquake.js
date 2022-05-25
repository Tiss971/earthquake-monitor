import { useEffect, useState, useContext } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';

import earthquakeService from '../../services/earthquakeService';
import { UserContext } from 'App';
export default function NearestEarthquake() {
    const { user } = useContext(UserContext);
    const [maxRadius, setMaxRadius] = useState(10);
    const [count, setCount] = useState(0);
    const [earthquakes, setEarthquakes] = useState();

    const [loading, setLoading] = useState(true);
    const handleMaxRadius = (event, newValue) => {
        setMaxRadius(newValue);
    };

    const fetchData = async () => {
        if (!user) return
        const latitude = user.location.coordinates[1];
        const longitude = user.location.coordinates[0];
        const data = await earthquakeService.getNearestEarthquake(latitude,longitude,maxRadius);
        setCount(data.features.length);
        setLoading(false);
    };
    useEffect (() => {
        setLoading(true)
        fetchData();  
    }, [user]);
    const handleSliderChange = (event, newValue) => {
        setMaxRadius(newValue);
    };
    
    const handleInputChange = (event) => {
        setMaxRadius(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleInputEnter = (event) => {
        if (event.keyCode == 13) {
            setLoading(true)
            fetchData();
        }
    };
    
    const handleBlur = () => {
        if (maxRadius < 0) {
          setMaxRadius(0);
        } else if (maxRadius > 20000) {
          setMaxRadius(20000);
        }
    };

    return (
        <Paper sx={{p:1}}>
            <Typography variant="h6" gutterBottom>
                Number of earthquakes within 
                <TextField 
                    sx={{mx:1,width: '75px'}}size="small" 
                    onBlur={handleBlur} onChange={handleInputChange} 
                    onKeyDown={handleInputEnter}
                    placeholder={maxRadius} value={maxRadius} 
                /> 
                km last month
            </Typography>
            <Slider
                onChange={handleSliderChange}
                onChangeCommitted={() => {setLoading(true);fetchData()}}
                aria-label="maxRadius"
                value={typeof maxRadius === 'number' ? maxRadius : 10}
                min={0}
                max={20000}
            />
            
            {loading ? <CircularProgress size={'3rem'}/> :
            <Paper sx={{backgroundColor:'primary.main'}}>
                <Typography variant="h6" gutterBottom>
                    Number of earthquakes
                </Typography>
                {count}
            </Paper>                
            }

        </Paper>
    
    )
}
