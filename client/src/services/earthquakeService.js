import axios from "axios"
const API_URL = process.env.REACT_APP_API_ENDPOINT

const getLatest = (time,magnitude) => {
    return axios.get(`${API_URL}/earthquake/latest/${time}/${magnitude}`)
        .then((response) => {
            return response.data
        })
}

const earthquakeService = {
  getLatest,
}
export default earthquakeService
