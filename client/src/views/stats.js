import Grid from "@mui/material/Grid"
import EarthquakeNumber from '../components/charts/earthquakeNumber'

export default function Stats() {
    return (
        <Grid container>
            <Grid item xs={12} md={6}>
                <EarthquakeNumber />
            </Grid>
            
        </Grid>
    )
}
