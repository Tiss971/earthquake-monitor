import Container from "@mui/material/Container"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"

export default function Error() {
    return (
        <Container
            sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            maxWidth="md"
        >
            <Card sx={{ maxWidth: 497 }} elevation={0}>
                <CardMedia
                    component="img"
                    height="373"
                    image={
                        process.env.PUBLIC_URL +
                        "/images/logo.png"
                    }
                />
                <CardContent>
                    <Typography variant="h4" color="text.secondary">
                        Error : Page not Found
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    )
}
