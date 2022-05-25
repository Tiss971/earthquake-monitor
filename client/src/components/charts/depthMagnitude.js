import { useEffect, useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import earthquakeService from '../../services/earthquakeService';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
const colors = ["#fd7f6f","#7eb0d5","#b2e061","#bd7ebe","#ffb55a","#ffee65","#beb9db","#fdcce5"];
ChartJS.register(ArcElement, Tooltip, Legend);

export default function DepthMagnitude() {
    const [range, setRange] = useState('day');
    const [loading, setLoading] = useState(true);
    const [ dataDepth, setDataDepth ] = useState([]);
    const [ depth, setDepth ] = useState([]);
    const [ dataMagnitude, setDataMagnitude ] = useState([]);
    const [ magnitude, setMagnitude ] = useState([]);
    const optionsDepth = {
        responsive: true,
        plugins: {
            legend: {
                position: 'left',
            },
            title: {
                display: true,
                text: 'Depth distribution',
            },
            tooltip: {
                callbacks: {
                  label: (ttItem) => 
                    `${ttItem.label}: ${
                        ((ttItem.parsed * 100) / ttItem.dataset.data.reduce((a, b) => Number(a) + Number(b),0)).toFixed(2)
                    }%`
                }
            }
        },
    };
    const optionsMagnitude = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Magnitude distribution',
            },
            /*datalabels: {
                display: true,
                align: 'bottom',
                backgroundColor: '#ccc',
                borderRadius: 3,
                font: {
                  size: 18,
                }
            },*/
            tooltip: {
                callbacks: {
                  label: (ttItem) => 
                    `${ttItem.label}: ${
                        ((ttItem.parsed * 100) / ttItem.dataset.data.reduce((a, b) => Number(a) + Number(b),0)).toFixed(2)
                    }%`
                }
            }
        },
    };
    
    const handleRange = (event) => {
        setRange(event.target.value);
    };

    useEffect (() => {
        setLoading(true)
        const fetchData = async () => {
            const data = await earthquakeService.getDepthMagnitude(range);
            setDepth({avg: data.avgDepth, distrib: data.distribDepth});
            setMagnitude({avg: data.avgMagnitude, distrib: data.distribMagnitude});
            const labelsDepth = Object.keys(data.distribDepth);
            const valuesDepth = Object.values(data.distribDepth);
            const labelsMagnitude = Object.keys(data.distribMagnitude);
            const valuesMagnitude = Object.values(data.distribMagnitude);

            setDataDepth({
                labels: labelsDepth.filter((key,index) => valuesDepth[index] > 0),
                datasets: [
                    {
                        data: valuesDepth.filter(value => value > 0),
                        backgroundColor: colors.map(color => color + 'b3'),
                        borderColor: colors,
                        borderWidth: 1,
                    },
                ],
            });

            setDataMagnitude({
                labels: labelsMagnitude.filter((key,index) => valuesMagnitude[index] > 0),
                datasets: [
                    {
                        data: valuesMagnitude.filter(value => value > 0),
                        backgroundColor: colors.slice(0,6).map(color => color + 'b3'),
                        borderColor: colors.slice(0,6),
                        borderWidth: 1,
                    },
                ],
            });
            setLoading(false);
        };
        fetchData();
        
    }, [range]);

    return (
        <Paper sx={{p:1}}>
            <Typography variant="h6" gutterBottom>
                Depth & Magnitude
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
            <Grid container spacing={3} justifyContent='center' alignItems='center'>
                {loading ? <Grid item xs><CircularProgress size={'3rem'}/></Grid> : <>
                    <Grid item xs={12} md={6}>
                        <Pie data={dataDepth} options={optionsDepth}/>
                        <Accordion>
                                <AccordionSummary
                                    sx={{border:'1px solid', borderColor:'primary.main'}}
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography> More depth stats</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container>
                                        {Object.keys(depth.distrib).map((key,index) => {
                                            return (
                                                <Grid item xs={12} md={6} key={key}>
                                                    <Paper elevation={1} sx={{border:'1px '+ colors[index] + ' solid', borderRadius:'4px', m:1}}>
                                                        <Typography>
                                                            {key} : {((depth.distrib[key] * 100) / Object.values(depth.distrib).reduce((a, b) => Number(a) + Number(b),0)).toFixed(2)}%
                                                        </Typography>
                                                    </Paper>
                                                </Grid>
                                            )
                                        })}
                                    </Grid>
                                </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Grid container item xs={12} md={6}>
                        <Pie data={dataMagnitude} options={optionsMagnitude}/>
                        <Accordion>
                            <AccordionSummary
                                sx={{border:'1px solid', borderColor:'primary.main'}}
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <Typography>More magnitude stats</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container>
                                    {Object.keys(magnitude.distrib).map((key,index) => {
                                        return (
                                            <Grid item xs={12} md={6} key={key}>
                                                <Paper elevation={1} sx={{border:'1px '+ colors[index] + ' solid', borderRadius:'4px', m:1}}>
                                                    <Typography>
                                                        {key} : {((magnitude.distrib[key] * 100) / Object.values(magnitude.distrib).reduce((a, b) => Number(a) + Number(b),0)).toFixed(2)}%
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        )
                                    })}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper sx={{padding: '1rem', backgroundColor: 'primary.main', '&:hover': { opacity: 0.9 }}}>
                            <Typography variant="h6" gutterBottom>
                                Average Depth : 
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {depth.avg.toFixed(2)} km
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper sx={{padding: '1rem', backgroundColor: 'primary.main', '&:hover': { opacity: 0.9 }}}>
                            <Typography variant="h6" gutterBottom>
                                Average Magnitude :
                            </Typography>

                            <Typography variant="body1" gutterBottom>
                                {magnitude.avg.toFixed(2)}
                            </Typography>
                        </Paper>
                    </Grid>

                </>}
            </Grid>
        </Paper>
    
    )
}
