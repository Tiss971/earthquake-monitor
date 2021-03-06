/*
 * Author: - Mathis
 * Filename: - App.js
 * Module: - App
 * Description: - Entry point of the application, contain router and pages of the application.
 */
import { useState, useEffect, useMemo, createContext } from "react"
import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom"

import Layout from "components/Layout"
import Admin from "./views/admin"
import Messages from "./views/messages"
import Chat from "./components/chat/chat"
import Parameters from "./views/parameters"
import Latest from "./views/latest"
import Stats from "./views/stats"
import Login from "./views/login"
import Register from "./views/register"
import Error404 from "./views/error404"

import "./css/App.css"

import AuthService from "services/auth"

import { socketService, socket } from "services/sioService"
export const SocketContext = createContext()

export const UserContext = createContext({
    user: null,
    setUser: () => {},
})

const App = () => {
    const [user, setUser] = useState(null)
    const value = useMemo(() => ({ user, setUser }), [user])
    useEffect(() => {
        AuthService.isAuthenticated().then((user) => {
            if (user) {
                localStorage.setItem("token", user.token)
                setUser(user.user)
            }
        })
    }, [])

    return (
        <div className="App">
            <BrowserRouter>
                <UserContext.Provider value={value}>
                    <Routes>
                        <Route
                            element={
                                <SocketContext.Provider
                                    value={{ socket, socketService }}
                                >
                                    <Layout user={user} />
                                </SocketContext.Provider>
                            }
                        >
                            <Route path="/" element={<Latest user={user} />} />
                            <Route
                                path="/chat"
                                element={
                                    user ? (
                                        <Messages user={user} />
                                    ) : (
                                        <Navigate to="/" />
                                    )
                                }
                            >
                                <Route path=":userID" element={<Chat />} />
                            </Route>
                            <Route path="/parameters" element={<Parameters user={user} />} />
                            <Route path="/stats" element={<Stats user={user} />} />
                            <Route
                                path="/admin"
                                element={
                                    user ? (
                                        <Admin user={user} />
                                    ) : (
                                        <Navigate to="/" />
                                    )
                                }
                            />
                            <Route path="*" element={<Error404 />} />
                        </Route>
                        {/* without layout */}
                        <Route
                            path="/login"
                            element={user ? <Navigate to="/" /> : <Login />}
                        />
                        <Route
                            path="/register"
                            element={user ? <Navigate to="/" /> : <Register />}
                        />

                        
                    </Routes>
                </UserContext.Provider>
            </BrowserRouter>
        </div>
    )
}

export default App
