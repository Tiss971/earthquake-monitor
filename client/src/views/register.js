import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"

import "../css/form.css"

import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Grow from "@mui/material/Grow"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"

import AuthService from "services/auth"

function Register() {
    const [DBerror, setDBerror] = useState("")
    const [registered, setRegistered] = useState(false)

    const {
        register,
        formState: { errors },
        getValues,
        handleSubmit,
    } = useForm({
        mode: "all",
    })
    const onSubmit = (data) => {
        Register(data)
    }

    let navigate = useNavigate()
    const Register = async (data) => {
        setDBerror("")
        if (data.Password === data.ConfirmPassword) {
            AuthService.register(data.username, data.Email, data.Password)
                .then((res) => {
                    if (res.data.ok) {
                        console.log("Registered")
                        setRegistered(true)
                        setTimeout(() => {
                            navigate("/login")
                        }, 2000)
                    } else setDBerror(res.data.message)
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            setDBerror("Passwords must match")
        }
        setTimeout(() => {
            setDBerror("")
        }, 3000)
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
            <Grid container justifyContent="center">
                <Grid item xs={12}>
                    <form className="customForm" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-inner">
                            <Container
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-around",
                                    alignItems: "flex-end",
                                }}
                            >
                                <Typography variant="h2">Register</Typography>
                                <img
                                    height="100"
                                    src={process.env.PUBLIC_URL + "/images/logo.png"}
                                    alt=""
                                ></img>
                            </Container>

                            <Container
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <div className="form-group">
                                    <label htmlFor="username">Username :</label>
                                    <input
                                        type="text"
                                        name="username"
                                        aria-invalid={
                                            errors.username ? "true" : "false"
                                        }
                                        autoComplete="username"
                                        {...register("username", {
                                            required: {
                                                value: true,
                                                message: "Username is required",
                                            },
                                            maxLength: {
                                                value: 20,
                                                message:
                                                    "Username must be 20 characters or less",
                                            },
                                            minLength: {
                                                value: 3,
                                                message:
                                                    "Username must be 3 characters or more",
                                            },
                                        })}
                                    />
                                    <Typography variant="caption" color="error">
                                        {errors.username && errors.username.message}
                                    </Typography>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mail">E-mail:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        aria-invalid={
                                            errors.Email ? "true" : "false"
                                        }
                                        {...register("Email", {
                                            required: {
                                                value: true,
                                                message: "Email is required",
                                            },
                                            maxLength: {
                                                value: 50,
                                                message:
                                                    "Email must be 50 characters or less",
                                            },
                                            pattern: {
                                                value: /^\S+@\S+$/i,
                                                message:
                                                    "Email must include '@' to respect a valid email pattern",
                                            },
                                        })}
                                    />
                                    <Typography variant="caption" color="error">
                                        {errors.Email && errors.Email.message}
                                    </Typography>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password:</label>
                                    <input
                                        type="password"
                                        name="password"
                                        autoComplete="new-password"
                                        aria-invalid={
                                            errors.Password ? "true" : "false"
                                        }
                                        {...register("Password", {
                                            required: {
                                                value: true,
                                                message: "Password is required",
                                            },
                                            minLength: {
                                                value: 8,
                                                message:
                                                    "Password must be 8 characters or more",
                                            },
                                        })}
                                    />
                                    <Typography variant="caption" color="error">
                                        {errors.Password && errors.Password.message}
                                    </Typography>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmpassword">
                                        Confirm Password:
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmpassword"
                                        autoComplete="new-password"
                                        aria-invalid={
                                            errors.ConfirmPassword ? "true" : "false"
                                        }
                                        {...register("ConfirmPassword", {
                                            required: {
                                                value: true,
                                                message: "Please confirm password !",
                                            },
                                            minLength: {
                                                value: 8,
                                                message:
                                                    "Password must be 8 characters or more",
                                            },
                                            validate: {
                                                matchesPreviousPassword: (value) => {
                                                    const { Password } = getValues()
                                                    return (
                                                        Password === value ||
                                                        "Passwords should match!"
                                                    )
                                                },
                                            },
                                        })}
                                    />
                                    <Typography
                                        variant="caption"
                                        color="error"
                                        role="alert"
                                    >
                                        {errors.ConfirmPassword &&
                                            errors.ConfirmPassword.message}
                                    </Typography>
                                </div>
                                {DBerror !== "" ? (
                                    <div className="error">{DBerror}</div>
                                ) : (
                                    ""
                                )}
                            </Container>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        sx={{ textTransform: "capitalize" }}
                                    >
                                        Register
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Link href="/login" variant="caption">
                                        {"Already have an account? Sign In"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </div>
                    </form>
                </Grid>
            </Grid>
            {/* Confirmation Alert */}
            <Grow
                in={registered}
                style={{ transformOrigin: "0 0 0" }}
                {...(registered ? { timeout: 1000 } : {})}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    sx={{ width: "70%", my: 1 }}
                >
                    <AlertTitle>
                        <strong> Redirection to login page </strong>
                    </AlertTitle>
                </Alert>
            </Grow>
            {!registered &&
                <Button href="/" variant="contained" color="warning" sx={{p:2}}>
                    <Typography variant="h6"  align="center">
                        Access without registered
                    </Typography> 
                </Button>
            }
        </Container>
    )
}

export default Register
