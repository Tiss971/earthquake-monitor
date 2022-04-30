import axios from "axios"
import authHeader from "./authHeader"

const API_URL = process.env.REACT_APP_API_ENDPOINT

const getCosmetics = () => {
    return axios.get(API_URL + "/shop/cosmetics").then((response) => {
        return response.data
    })
}
const getWildcards = () => {
    return axios.get(API_URL + "/shop/wildcards").then((response) => {
        return response.data
    })
}

const buyCosmetics = (id) => {
    return axios
        .get(API_URL + "/shop/cosmestics/buy", { headers: authHeader(), id: id })
        .then((response) => {
            return response
        })
}
const buyWildcards = (id, amount) => {
    return axios
        .get(API_URL + "/shop/wildcards/buy", {
            headers: authHeader(),
            id: id,
            amount: amount,
        })
        .then((response) => {
            return response
        })
}
const shopService = {
    getCosmetics,
    getWildcards,
    buyCosmetics,
    buyWildcards,
}
export default shopService
