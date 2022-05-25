import { useEffect, useState, useContext} from 'react'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'

import { UserContext } from 'App'
import userService from 'services/userService'
import AuthService from 'services/auth'

export default function UserGestion() {
    const { user, setUser } = useContext(UserContext)

    const [newUser, setNewUser] = useState({})

    const [confirmPasswordDialog, setConfirmPasswordDialog] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')

    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [successMessage, setSuccessMessage] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        setNewUser(JSON.parse(JSON.stringify(user)))
    },[user])

    const handleUsernameChange = (event) => {
        setNewUser({...newUser, username: event.target.value})
    }
    const handleUsernameEnter = (event) => {
        if (event.keyCode === 13) {
            setNewUser({...newUser, username: event.target.value})
        }
    }

    const handleEmailChange = (event) => {
        setNewUser({...newUser, email: event.target.value})
    }
    const handleEmailEnter = (event) => {
        if (event.keyCode === 13) {
            setNewUser({...newUser, email: event.target.value})
        }
    }

    const handleUserSubmit = (event) => {
        event.preventDefault()
        userService.updateUser(newUser)
            .then(res => {
                if (res.data.ok) {
                    setSuccessMessage('User updated')
                    setSuccess(true)
                    AuthService.isAuthenticated().then((user) => {
                        if (user) {
                            localStorage.setItem("token", user.token)
                            setUser(user.user)
                        }
                    })
                }
            })
            .catch(error => {
                setErrorMessage('Something went wrong')
                setError(true)
                setErrorMessage(error.response.data)
            })
    }

    const handlePasswordChange = (event) => {
        setNewUser({...newUser, password: event.target.value})
    }
    const handlePasswordEnter = (event) => {
        if (event.keyCode === 13) {
            setNewUser({...newUser, password: event.target.value})
        }
    }

    const handlePasswordSubmit = (event) => {
        event.preventDefault()
        setConfirmPasswordDialog(true)
    }
    const handleConfirmPasswordDialogClose = (event) => {
        setConfirmPasswordDialog(false)
    }
    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value)
    }
    const handleConfirmPasswordEnter = (event) => {
        if (event.keyCode === 13) {
            setConfirmPassword(event.target.value)
        }
    }
    const handleConfirmPasswordSubmit = (event) => {
        event.preventDefault()
        if (confirmPassword === newUser?.password) {
            userService.updatePassword(newUser)
                .then(res => {
                    if (res.data.ok) {
                        setSuccessMessage('Password updated')
                        setSuccess(true)
                        setUser(res.data.user)
                    }
                })
                .catch(err => {
                    setErrorMessage('Something went wrong')
                    setError(true)
                    console.log(err)
                })
        } else {
            setErrorMessage('Passwords do not match')
            setError(true)
        }
    }

    return (
        <Grid container justifyContent="center" alignItems="center" direction="column" spacing={2} sx={{width:'100%'}}>
            <Grid item xs={12}>
                <Typography variant="h6">Manage user informations</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="caption">
                    You can change your informations here
                </Typography>
            </Grid>
            <Grid container item xs={12} justifyContent="center">
                <TextField
                    id="standard-basic"
                    label="Username"
                    placeholder={newUser?.username}
                    onChange={handleUsernameChange}
                    onKeyDown={handleUsernameEnter}
                    sx={{ mb: 1 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: "capitalize",mb:1 }}
                    onClick = {handleUserSubmit}
                >
                    Save
                </Button>

            </Grid>
            <Grid container item xs={12} justifyContent="center">
                <TextField
                    id="standard-basic"
                    label="Email"
                    placeholder={newUser?.email}
                    onChange={handleEmailChange}
                    onKeyDown={handleEmailEnter}
                    sx={{ mb: 1 }}
                />
                 <Button
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: "capitalize", mb:1 }}
                    onClick = {handleUserSubmit}
                >
                    Save
                </Button>
            </Grid>
            <Grid container item xs={12} justifyContent="center">
                <TextField
                    id="standard-basic"
                    label="Password"
                    onChange={handlePasswordChange}
                    onKeyDown={handlePasswordEnter}
                    sx={{ mb: 1 }}
                />
                 <Button
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: "capitalize", mb:1 }}
                    onClick = {handlePasswordSubmit}
                >
                    Save
                </Button>
            </Grid>

            <Dialog open={confirmPasswordDialog} onClose={handleConfirmPasswordDialogClose}>
                <DialogTitle>Confirm Password</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Please confirm your password
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    onChange={handleConfirmPasswordChange}
                    onKeyDown={handleConfirmPasswordEnter}
                    fullWidth
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleConfirmPasswordDialogClose}>Cancel</Button>
                <Button onClick={handleConfirmPasswordSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
            {/* Snackbasr */}
            <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
                <Alert onClose={() => setSuccess(false)} severity="success">
                    {successMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={error} autoHideDuration={6000} onClose={() => setError(false)}>
                <Alert onClose={() => setError(false)} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>

        </Grid>
    );
}