/*
 * Author: - Mathis
 * Filename: - App.js
 * Module: - App
 * Description: - Entry point of the application, contain router and pages of the application.
 */
import {useState, useEffect} from "react"
import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom"

import Layout from "components/Layout"
import Admin from "./views/admin"
import Chat from "./components/chat/chat"
import Infos from "./views/infos"
import Menu from "./views/menu"
import Stats from "./views/stats"
import Login from "./views/login"
import Register from "./views/register"
import Error404 from "./views/error404"



import './css/App.css';

import AuthService from "services/auth"

const App = () => {
    const [user,setUser] = useState(null);
    useEffect(() => {
        AuthService.isAuthenticated().then(user => {
            localStorage.setItem("token", user.token)
            setUser(user.user);
        })
    }, [])

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout user={user} />}>
                        <Route path="/" element={<Menu user={user}/>} />
                        <Route path="/chat" element={<Chat user={user}/>} />
                        <Route path="/infos" element={<Infos user={user}/>} />
                        <Route path="/stats" element={<Stats user={user}/>} />
                        <Route path="/admin" element={user ? <Admin user={user}/> : <Navigate to="/" />} />
                    </Route>
                
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="*" element={<Error404 />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
