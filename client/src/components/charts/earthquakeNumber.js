import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import earthquakeService from '../../services/earthquakeService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
        display : false,
        position: 'right',
    },
    title: {
      display: false,
      text: 'Number of earthquakes',
    },
  },
};

export default function EarthquakeNumber() {
    const [range, setRange] = useState('day');
    const [magnitude, setMagnitude] = useState('all');
    const [loading, setLoading] = useState(true);
    const handleRange = (event) => {
        setRange(event.target.value);
    };
    const handleMagnitude = (event) => {
        setMagnitude(event.target.value);
    };

    const [data, setData] = useState({});
    useEffect (() => {
        setLoading(true)
        const fetchData = async () => {
            const data = await earthquakeService.getEarthquakeNumber(range,magnitude);
            const labels = Object.keys(data.count);
            const values = Object.values(data.count);
            setData({
                labels,
                datasets: [
                    {
                        label: 'Number of earthquakes',
                        data: values,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    },
                ],
            });
            setLoading(false);
        };
        fetchData();
        
    }, [range,magnitude]);

    return (
        <Paper sx={{minHeight:'50vh'}}>
            <Typography variant="h6" gutterBottom>
                Number of earthquakes
            </Typography>
            <FormControl>
                <RadioGroup
                    row
                    aria-labelledby="row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={range}
                    onChange={handleRange}
                >
                    <FormControlLabel value="day" control={<Radio />} label="Today" />
                    <FormControlLabel value="week" control={<Radio />} label="7 Days" />
                    <FormControlLabel value="month" control={<Radio />} label="30 Days" />
                </RadioGroup>
            </FormControl>
            <br/>
            <FormControl>
                <RadioGroup
                    row
                    aria-labelledby="row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={magnitude}
                    onChange={handleMagnitude}
                >
                    <FormControlLabel value="all" control={<Radio />} label="All" />
                    <FormControlLabel value="2.5" control={<Radio />} label="> 2.5" />
                    <FormControlLabel value="4.5" control={<Radio />} label="> 4.5" />
                </RadioGroup>
            </FormControl>
            <Grid container spacing={3}>
                <Grid container item xs={7} md={12} justifyContent='center' >
                    {!loading ? <Line options={options} data={data}/> : <CircularProgress size={'3rem'}/>}
                </Grid>
                <Grid container item xs direction='column'>
                    <Grid item> 
                        Last hour : 
                    </Grid>
                    <Grid item> 
                        Last day : 
                    </Grid>
                    <Grid item> 
                        Last week : 
                    </Grid>
                    <Grid item> 
                        Last month : 
                    </Grid>
                </Grid>
            </Grid>

        </Paper>
    
    )
}
