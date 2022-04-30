import axios from "axios"
import authHeader from "./authHeader"

const API_URL = process.env.REACT_APP_API_ENDPOINT

const register = (username, email, password) => {
    return axios.post(API_URL + "/auth/register", {
        username,
        email,
        password,
    })
}
const login = (username, password) => {
    return axios
        .post(API_URL + "/auth/login", {
            username,
            password,
        })
        .then((response) => {
            if (response.data.ok) {
                localStorage.setItem("token", response.data.token)
            }
            return response
        })
}
const isAuthenticated =  () => {
    return axios.get(API_URL + "/auth/google/success", { withCredentials: true })
    .then((res) => {
        if (res.status === 200) return res.data
        throw new Error("authentication has been failed!");
    })
    .catch((err) => {
        console.log(err);
    })
}

const logout = () => {
    return axios
        .get(API_URL + "/auth/logout", { withCredentials: true })
        .then((response) => {
            if (response.data.ok) {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                window.location.href = "/login"
            }
            return response.data
        })
}
const privateTest = () => {
    return axios.get(API_URL + "/user/privateUsers") 
}
const privateTestWithAuth = () => {
    return axios.get(API_URL + "/user/privateUsers", { headers: authHeader() })
}
const publicTest = () => {
    return axios.get(API_URL + "/user/publicUsers") 
}
/* Locally verify token with token from local storage */
const verifyJWT = () => {
    return axios
        .get(API_URL + "/auth/verifyJWT", { headers: authHeader() })
        .then((response) => {
            return response
        })
}
const AuthService = {
    register,
    login,
    isAuthenticated,
    logout,
    privateTest,
    privateTestWithAuth,
    verifyJWT,
    publicTest,
}
export default AuthService
