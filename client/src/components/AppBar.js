import * as React from "react"
import {useContext} from "react"
import { UserContext } from "App"
import { useNavigate, NavLink } from "react-router-dom"
import i18next from "../i18n"

import { useTheme } from "@mui/material/styles"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Toolbar from "@mui/material/Toolbar"
import Icon from "@mui/material/Icon"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Menu from "@mui/material/Menu"
import MenuIcon from "@mui/icons-material/Menu"
import Container from "@mui/material/Container"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"

import ArgisAutocomplete from "../components/ArgisAutocomplete"

import AuthService from "../services/auth"

const ResponsiveAppBar = (props) => {
    const theme = useTheme();
    const [anchorElNav, setAnchorElNav] = React.useState(null)
    const [anchorElUser, setAnchorElUser] = React.useState(null)
    const {user, setUser} = useContext(UserContext)

    const pages = [
        {name: "Latest", path: '/'},
        //{name: "Informations", path: '/infos'},
        {name: "Stats", path: '/stats'},
        {name: "Chat", path: '/chat', logged:true},
        {name: "Admin", path: '/admin', admin:true}
    ]

    // Menus
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget)
    }
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget)
    }
    const handleCloseNavMenu = () => {
        setAnchorElNav(null)
    }
    const handleCloseUserMenu = () => {
        setAnchorElUser(null)
    }

    let navigate = useNavigate();
    
    const handleClick = (e,page) => {
        const disabled = (page.logged && !user) || (page.admin && !user?.admin)
        if(disabled) e.preventDefault()
        else handleCloseNavMenu()
    }

    // Translation I18n
    const [Language, setLanguage] = React.useState("en")
    const handleChange = (event) => {
        setLanguage(event.target.value)
        i18next.changeLanguage(event.target.value)
    }

    // Dark mode
    const switchColorMode = () => {
        props.onSwitchMode()
    }

    // Active Style
    let activeStyle = {
        textDecoration: "underline",
        color : theme.palette.secondary.main
    };
    let inactiveStyle = {
        textDecoration: "none",
        color: theme.palette.mode === "dark" ? "#fff" : "#000"
    };
   
    return (
        <AppBar
            position="static"
            sx={{ bgcolor: "background.default", color: "text.primary" }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* AppName */}
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ mr: 2, justifyContent:'center', alignItems:'center', display: { xs: "none", md: "flex" } }}
                    >
                        <img height='48px' src={process.env.PUBLIC_URL + '/images/logo.png'} alt="logo"/>
                        Earthquake Monitor
                    </Typography>

                    {/* Menu Button + link list if small */}
                    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        >
                            {pages.map((page) => (
                                <NavLink 
                                    onClick={(e) => handleClick(e,page)}
                                    key={page.name}  
                                    to={page.path}
                                    style={({ isActive }) =>
                                        isActive ? activeStyle : inactiveStyle
                                    } 
                                    end
                                >
                                    {({ isActive }) => (
                                        <MenuItem 
                                            disabled={(page.logged && !user) || (page.admin && !user?.admin)}
                                            sx={{
                                                fontSize:  isActive ? '1.1em' : '1em', 
                                                fontWeight: isActive ? 'bold' : 'normal',
                                                borderRadius: '5px'
                                            }}
                                        >
                                            {isActive ? '•' :''} {page.name}
                                        </MenuItem>
                                    )}
                              </NavLink>
                                   
                             
                            ))}
                        </Menu>
                    </Box>

                    {/* App Logo if small */}
                    <Typography sx={{ flexGrow: 1, justifyContent:'center', alignItems:'center', display: { xs: "flex", md: "none" } }}
                        variant="h6"
                        component="div"
                    >
                        <img height='48px' src={process.env.PUBLIC_URL + '/images/logo.png'} alt="logo"/>
                        Earthquake Monitor
                    </Typography>

                    {/* Link list if big */}
                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                        {pages.map((page) => (
                            <NavLink
                                onClick={(e) => handleClick(e,page)}
                                key={page.path}
                                to={page.path}
                                style={({ isActive }) =>
                                    isActive ? activeStyle : inactiveStyle
                                }
                            >
                                {({ isActive }) => (
                                    <Button
                                        key={page.path}
                                        disabled={(page.logged && !user) || (page.admin && !user?.admin)}
                                        sx={{ 
                                            display: "block", 
                                            color: isActive ? "inherit" : "text.primary" ,
                                            fontSize: isActive ? '1.1em' : '1em',
                                            fontWeight: isActive ? 'bold' : 'normal',
                                        }}
                                    >
                                            {page.name}
                                    </Button>
                                )}
                            </NavLink>
                        ))}
                    </Box>

                    {/* Dark/Light Mode */}
                    <Box sx={{textTransform:'capitalize', mr:2}}>
                        <IconButton aria-label="Switch ColorMode" onClick={() => switchColorMode()}>
                            <Icon   
                                baseClassName="fas" 
                                className={theme.palette.mode === 'dark' ? 'fa-moon' :' fa-sun'}
                            />
                        </IconButton>
                        
                    </Box>

                    {/* Languages list */}
                    <Box sx={{ minWidth: { xs: 100, md: 100 } }}>
                        <FormControl fullWidth>
                            <Select
                                value={Language}
                                onChange={handleChange}
                                variant="outlined"
                                sx={{mr: 2, borderRadius: 2 }}
                            >
                                <MenuItem value={"en"}>EN</MenuItem>
                                <MenuItem value={"fr"}>FR</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Parameters Button */}
                    <Box sx={{ flexGrow: 0, display : user ? 'visible' : 'none' }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar
                                    alt="Remy Sharp"
                                    src={user?.image||"/static/images/avatar/2.jpg"}
                                />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <Box sx={{px:2, maxWidth:'200px'}}>
                                <Box sx={{display:'flex'}}>
                                    <Icon   
                                        baseClassName="fas" 
                                        className="fa-location-dot"
                                    />
                                    <Typography>
                                        Location :
                                    </Typography>
                                </Box>
                                <ArgisAutocomplete/>
                                <Button fullWidth
                                    onClick={() => {navigate('/parameters')}} 
                                    variant="contained"
                                    color="success"
                                    startIcon={<Icon
                                        baseClassName="fas" 
                                        className="fa-gear"
                                    />}
                                >
                                    <Typography>
                                        Parameters
                                    </Typography>
                                </Button>
                                <Divider variant='middle' sx={{my:1}}></Divider>
                                <Button fullWidth
                                    onClick={() => {
                                        AuthService.logout().then((response) => {
                                            if (response.data.ok) {
                                                localStorage.removeItem("token")
                                                localStorage.removeItem("user")
                                                setUser(null)
                                            }
                                        })
                                        .then(() => {
                                            navigate('/login')
                                        });
                                        handleCloseUserMenu()
                                    }}
                                    variant="contained"
                                    color="error"
                                    startIcon={<Icon   
                                        baseClassName="fas" 
                                        className="fa-arrow-right-to-bracket"
                                    />}
                                >
                                    Logout
                                </Button>
                            </Box>
                        </Menu>
                    </Box>
                    {/* Log/Register Button */}
                    <Box sx={{ flexGrow: 0, display : user ? 'none' : 'visible' }}>
                        <Tooltip title="Iniciate session">
                            <Button variant="contained" 
                                onClick={() => {navigate('/login')}} 
                                sx={{ m: 1 }}
                            >
                                Sign In
                            </Button>
                        </Tooltip>
                        <Tooltip title="Create account">
                            <Button variant="contained" 
                                color="secondary" 
                                onClick={() => {navigate('/register')}} 
                                sx={{ m: 1 }}
                            >
                                Sign Up
                            </Button>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default ResponsiveAppBar
