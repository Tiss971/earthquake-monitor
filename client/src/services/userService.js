import axios from "axios"
import authHeader from "./authHeader"

const API_URL = process.env.REACT_APP_API_ENDPOINT

const getUserById = (id) => {
    return axios.get(`${API_URL}/user/${id}`, authHeader())
        .then((response) => {
            return response.data
        })
}
const getAll = () => {
    return axios.get(API_URL + "/user/publicUsers").then((response) => {
        return response.data
    })
}

const getClosest = (location) => {
    return axios.get(API_URL + "/user/closest/" + location)
        .then((response) => {
            return response.data
        })
}


const userService = {
    getUserById,
    getAll,
    getClosest
}
export default userService
