import axios from "axios";
const API_URL = process.env.REACT_APP_API_ENDPOINT;

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

const getEarthquakeNumber = (range,magnitude) => {
    return axios.get(`${API_URL}/earthquake/number/${range}/${magnitude}`)
        .then((response) => {
            return response.data
        })
}

const getDepthMagnitude = (range) => {
    return axios.get(`${API_URL}/earthquake/depthMagnitude/${range}`)
        .then((response) => {
            return response.data
        })
}

const getNearestEarthquake = (latitude,longitude,maxRadius) => {
    return axios.get(`${API_URL}/earthquake/nearestEarthquake/${latitude}/${longitude}/${maxRadius}`
    ,{withCredentials: true})
        .then((response) => {
            return response.data
        })
}


const earthquakeService = {
    getLatest,
    getNearestUsers,
    getEarthquakeNumber,
    getDepthMagnitude,
    getNearestEarthquake
}
export default earthquakeService
