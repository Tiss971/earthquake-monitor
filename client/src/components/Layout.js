import * as React from "react"
import { Outlet } from "react-router-dom"
import { loadCSS } from "fg-loadcss"

import { ThemeProvider, createTheme } from "@mui/material/styles"
import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"

import ResponsiveAppBar from "./AppBar"

const Layout = (props) => {
    const [mode, setMode] = React.useState('dark');
    const colorMode = React.useMemo(
        () => ({
          toggleColorMode: () => {
            setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
          },
        }),
        [],
    );
    const theme = 
        createTheme({
            components: {
                // Known fix for padding issue with icon
                MuiIcon: {
                    styleOverrides: {
                        root: {
                            // Match 24px = 3 * 2 + 1.125 * 16
                            boxSizing: "content-box",
                            padding: 3,
                            fontSize: "1.125rem",
                        },
                    },
                },
                // Custom scrollbars
                MuiCssBaseline: {
                    styleOverrides: {
                        body: {
                            "*::-webkit-scrollbar": {
                                backgroundColor: "lightgrey",
                                width:"10px",
                            },
                            "*::-webkit-scrollbar, & *::-webkit-scrollbar-thumb": {
                                width: "26px",
                                borderRadius: "16px",
                                backgroundClip: "padding-box",
                                border: "10px solid transparent",
                                color: "grey",
                            },
                            "*::-webkit-scrollbar-thumb": {
                                boxShadow: "inset 0 0 0 10px",
                            },
                            "*::-webkit-scrollbar-track": {
                                backgroundColor: "transparent"
                            }
                        },
                    },
                },
            },
            palette: {
                mode,
                primary: {
                    main: mode === 'dark' ? "#146356" : "#A3DA8D",
                },
                secondary: {
                    main: mode === 'dark' ? "#FFF1BD" : "#F3C892",
                },
                accent: {
                    main: "#CADEFC",
                },
                light: {
                    main: "#E8F0FC",
                },
            },
        });

    React.useEffect(() => {
        const node = loadCSS(
            "https://use.fontawesome.com/releases/v6.1.1/css/all.css",
            // Inject before JSS
            document.querySelector("#font-awesome-css") || document.head.firstChild
        )

        return () => {
            node.parentNode.removeChild(node)
        }
    }, [])

    return (
            <ThemeProvider theme={theme}>
                <Box>
                    <CssBaseline enableColorScheme />
                    {/* TOP BAR */}
                    <ResponsiveAppBar onSwitchMode={colorMode.toggleColorMode} user={props.user}/>
                    {/* CONTENT */}
                    <Box component="main" sx={{ flexGrow: 1, mx: 2, mt:2, overflow:'hidden' }}>
                       
                        <Outlet />
                    </Box>
                </Box>
            </ThemeProvider>
    )
}

export default Layout
