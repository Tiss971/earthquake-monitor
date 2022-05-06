import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"

import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Divider from '@mui/material/Divider'
import Grid from "@mui/material/Grid"
import Grow from '@mui/material/Grow'
import Icon from "@mui/material/Icon"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"

import AuthService from "services/auth"

import "../css/form.css"
import { WindowSharp } from "@mui/icons-material"

function Login() {
    const [DBerror, setDBerror] = useState("")
    const [logged, setLogged] = useState(false)

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        mode: "all",
    })

    let navigate = useNavigate()
    /* GOOGLE LOGIN */
    const google = () => {
        //let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
        //   width=600,height=600,left=100,top=100`;
        window.open("http://localhost:5000/auth/google", "_self");
    }
   
    /* Username and Password Login */
    const Login = (data) => {
        setDBerror("")
        AuthService.login(data.username, data.password)
            .then((res) => {
                if (res.data.ok) {
                    setLogged(true)
                    setTimeout(() => {
                        window.open("/", "_self");
                    }, 2000)
                } else {
                    setDBerror(res.data.message)
                }
            })
            .catch((err) => {
                setDBerror(err.response.data.message)
            })
    }

    return (
        <Container
            maxWidth="xs"
            sx={{ 
                display: "flex", 
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",  
                height: "100vh",
            }}
        >   
            {/* Form */}
            <form
                className="customForm"
                onSubmit={handleSubmit(Login)}
            >
                <div className="form-inner">
                    <Grid item xs={12}>
                        {/* Register Log In */}                        
                        <Container
                            sx={{
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                                mb:1
                            }}
                        >
                            <h2>Log in</h2>
                            <img
                                height="100"
                                src={
                                    process.env.PUBLIC_URL +
                                    "/images/logo.png"
                                }
                                alt=""
                            ></img>
                        </Container>
                        {/* Username Or Email */}   
                        <div className="form-group">
                            <label htmlFor="username">Username or email:</label>
                            <input
                                type="text"
                                name="username"
                                {...register("username", {
                                    required: {
                                        value: true,
                                        message: "Username is required",
                                    },
                                })}
                                autoComplete="username"
                            />
                            <Typography variant="caption" color="error">
                                {errors.username && errors.username.message}
                            </Typography>
                        </div>
                        {/* Password */}
                        <div className="form-group">
                            <label htmlFor="psw">Password:</label>
                            <input
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                {...register("password", {
                                    required: {
                                        value: true,
                                        message: "Password is required",
                                    },
                                })}
                            />
                            <Typography variant="caption" color="error">
                                {errors.password && errors.password.message}
                            </Typography>
                        </div>
                        {/* (Opcional) Error */}
                        {DBerror !== "" ? (
                            <div className="error">{DBerror}</div>
                        ) : (
                            ""
                        )}
                        {/* Submit */}
                        <Grid container>
                            <Grid item xs={4}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ textTransform: "capitalize" }}
                                >
                                    Login
                                </Button>
                            </Grid>
                            <Grid item xs={8}>
                                <Link href="/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                        {/* Google Login */}
                        <Divider sx={{my:2}}> Or log with </Divider>
                        
                        <Button 
                            variant="contained"
                            onClick={google}
                            startIcon={<Icon baseClassName="fas" className="fa-google" />}
                        >
                            Login with Google
                        </Button>
                    </Grid> 
                </div>
            </form>
            {/* Confirmation Alert */}
            <Grow
                in={logged}
                style={{ transformOrigin: '0 0 0' }}
                {...(logged ? { timeout: 1000 } : {})}
            >
                <Alert severity="success" variant="filled" sx={{width:'50%',my:1}}>
                    <AlertTitle>
                        <strong> Welcome </strong>{" "}
                    </AlertTitle>
                </Alert>
            </Grow>
        </Container>
    )
}

export default Login
