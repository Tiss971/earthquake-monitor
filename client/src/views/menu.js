import { useTheme } from "@mui/material/styles"
import Button from "@mui/material/Button"
import AuthService from "../services/auth"

export default function Menu() {
    const theme = useTheme()
    function handlePrivate(e) {
        e.preventDefault()
        AuthService.privateTest().then((response) => {
            console.log(response)
        })
    }

    function handlePublic(e) {
        e.preventDefault()
        AuthService.publicTest().then((response) => {
            console.log(response)
        })
    }

    function handlePrivateWithAuth(e) {
        e.preventDefault()
        AuthService.privateTestWithAuth().then((response) => {
            console.log(response)
        })
    }

    function handleVerifyJWT(e) {
        e.preventDefault()
        AuthService.verifyJWT()
            .then((response) => {
                console.log(response)
            })
            .catch((err) => {
                if (err.response.data === "Unauthorized") {
                    //TODO: show error
                    console.log("Redirection to logout")
                } else {
                    console.log(err.response)
                }
            })
    }

    function currentUser(e) {
        e.preventDefault()
        AuthService.currentUser().then((response) => {
            console.log(response.data)
        })
    }
    function Swagger(e) {
        e.preventDefault()
        window.open(process.env.REACT_APP_API_ENDPOINT + "/docs", "_blank")
    }

    return (
        <div>
            <Button variant="contained" onClick={handlePrivate}>
                Private
            </Button>
            <Button variant="contained" onClick={handlePublic}>
                Public
            </Button>
            <Button variant="contained" onClick={handlePrivateWithAuth}>
                Private with Auth
            </Button>
            <Button variant="contained" onClick={handleVerifyJWT}>
                Check Token
            </Button>
            <Button variant="contained" onClick={currentUser}>
                Current User
            </Button>
            <Button variant="contained" onClick={Swagger}>
                API Docs
            </Button>

            {theme.mode}
        </div>
    )
}
