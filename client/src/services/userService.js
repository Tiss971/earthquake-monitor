import axios from "axios"
import authHeader from "./authHeader"

const API_URL = process.env.REACT_APP_API_ENDPOINT

const getUserById = (id) => {
    return axios.get(`${API_URL}/user/${id}`, authHeader()).then((response) => {
        return response.data
    })
}
const getAll = () => {
    return axios.get(API_URL + "/user/publicUsers").then((response) => {
        return response.data
    })
}

const setLocation = (location, address) => {
    return axios
        .put(
            API_URL + "/user/setLocation",
            { location, address },
            { withCredentials: true }
        )
        .then((response) => {
            return response.data
        })
}

const setPublic = (isPublic) => {
    return axios
        .put(
            API_URL + "/user/setPublic",
            { public: isPublic },
            { withCredentials: true }
        )
        .then((response) => {
            return response.data
        })
}

const getUser = () => {
    return axios
        .get(API_URL + "/user/", { withCredentials: true })
        .then((response) => {
            return response.data
        })
}

const userService = {
    getUserById,
    getAll,
    setLocation,
    setPublic,
    getUser,
}
export default userService
