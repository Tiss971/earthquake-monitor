import axios from "axios"
import authHeader from "./authHeader"
const API_URL = process.env.REACT_APP_API_ENDPOINT

const getLatest = (time,magnitude) => {
    return axios.get(`${API_URL}/earthquake/latest/${time}/${magnitude}`)
        .then((response) => {
            return response.data
        })
}

const getNearestUsers = (latitude,longitude) => {
    return axios.get(`${API_URL}/earthquake/nearestUsers/${latitude}/${longitude}`
    ,{withCredentials: true})
        .then((response) => {
            return response.data
        }
        )
}


const earthquakeService = {
  getLatest,
  getNearestUsers
}
export default earthquakeService
