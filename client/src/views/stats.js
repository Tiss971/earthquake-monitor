import Grid from "@mui/material/Grid"
import EarthquakeNumber from '../components/charts/earthquakeNumber'
import DepthMagnitude from '../components/charts/depthMagnitude'
import NearestEarthquake from '../components/charts/nearestEarthquake'

export default function Stats() {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <EarthquakeNumber />
            </Grid>
            <Grid item xs={12} md={6}>
                <DepthMagnitude />
            </Grid>
            <Grid item xs={12} md={6}>
                <NearestEarthquake />
            </Grid>
            
        </Grid>
    )
}
