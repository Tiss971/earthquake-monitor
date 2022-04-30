export default function authHeader() {
    const token = localStorage.getItem("token")
        ? "Bearer " + localStorage.getItem("token")
        : null
    if (token) {
        // for Node.js Express back-end
        return { authorization: token }
    } else {
        return {}
    }
}
