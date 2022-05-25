const axios = require("axios")
var User = require("../../database/models/user")

function get_earthquakes(req, res) {
    var time = req.params.time
    var magnitude = req.params.magnitude

    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/"
    const query = `${url}${magnitude}_${time}.geojson`
    axios
        .get(query)
        .then((response) => {
            res.send(response.data)
        })
        .catch((err) => {
            res.json(err)
        })
}
function count_earthquakes(req, res) {
    const range = req.params.range
    const magnitude = req.params.magnitude

    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/"
    const query = `${url}${magnitude}_${range}.geojson`
    axios
        .get(query)
        .then((response) => {
            var data = response.data.features
            var timestamp = data.map((item) => item.properties.time)
            timestamp.sort(function (a, b) {
                return a - b
            })
            // create array with number of occurences by day
            const count = {}
            for (var i = 0; i < timestamp.length; i++) {
                var current = new Date(timestamp[i])
                let key = null
                switch (range) {
                    case "hour":
                        key = current.toLocaleString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        break
                    case "day":
                        key = current.toLocaleString(undefined, { hour: "2-digit" })
                        break
                    case "week":
                        key = current.toLocaleString(undefined, {
                            weekday: "short",
                            day: "2-digit",
                            month: "2-digit",
                        })
                        break
                    case "month":
                        key = current.toLocaleString(undefined, {
                            month: "short",
                            day: "2-digit",
                        })
                        break
                    default:
                        return
                }
                if (key in count) {
                    count[key]++
                } else {
                    count[key] = 1
                }
            }
            const lenght = data.length
            res.send({ ok: true, count, lenght })
        })
        .catch((err) => {
            res.json(err)
        })
}
function avg_depth_magnitude(req, res) {
    const range = req.params.range
    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/"
    const query = `${url}all_${range}.geojson`
    console.log(query)
    axios
        .get(query)
        .then((response) => {
            var data = response.data.features
            var depth = data.map((item) => item.properties.gap)
            var magnitude = data.map((item) => item.properties.mag)
            var avgDepth = depth.reduce((a, b) => a + b, 0) / depth.length
            var avgMagnitude =
                magnitude.reduce((a, b) => a + b, 0) / magnitude.length

            const distribDepth = {
                "0 - 3 km": 0,
                "3 - 10 km": 0,
                "10 - 20 km": 0,
                "20 - 50 km": 0,
                "50 - 100 km": 0,
                "100 - 200 km": 0,
                "200 - 500 km": 0,
                "> 500 km": 0,
            }
            depth.forEach((item) => {
                if (item < 3) {
                    distribDepth["0 - 3 km"]++
                } else if (item < 10) {
                    distribDepth["3 - 10 km"]++
                } else if (item < 20) {
                    distribDepth["10 - 20 km"]++
                } else if (item < 50) {
                    distribDepth["20 - 50 km"]++
                } else if (item < 100) {
                    distribDepth["50 - 100 km"]++
                } else if (item < 200) {
                    distribDepth["100 - 200 km"]++
                } else if (item < 500) {
                    distribDepth["200 - 500 km"]++
                } else {
                    distribDepth["> 500 km"]++
                }
            })
            const distribMagnitude = {
                "0 - 1": 0,
                "1 - 2.5": 0,
                "2.5 - 4.5": 0,
                "4.5 - 8": 0,
                "> 8": 0,
            }
            magnitude.forEach((item) => {
                if (item < 1) {
                    distribMagnitude["0 - 1"]++
                } else if (item < 2.5) {
                    distribMagnitude["1 - 2.5"]++
                } else if (item < 4.5) {
                    distribMagnitude["2.5 - 4.5"]++
                } else if (item < 8) {
                    distribMagnitude["4.5 - 8"]++
                } else {
                    distribMagnitude["> 8"]++
                }
            })
            const length = data.length
            res.send({
                ok: true,
                avgDepth,
                avgMagnitude,
                distribDepth,
                distribMagnitude,
                length,
            })
        })
        .catch((err) => {
            res.json(err)
        })
}

function get_nearest_users(req, res) {
    var latitude = req.params.latitude
    var longitude = req.params.longitude
    User.find(
        {
            public: true,
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [latitude, longitude],
                    },
                },
            },
        },
        "_id username image location lastVisit",
        function (err, users) {
            if (err)
                return res.status(500).send("There was a problem finding the users.")
            res.status(200).send(users)
        }
    ).limit(5)
}

function get_nearest_earthquake(req, res) {
    var latitude = req.params.latitude
    var longitude = req.params.longitude
    var maxRadius = req.params.maxRadius
    var url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&"
    var query = `${url}latitude=${latitude}&longitude=${longitude}&maxradiuskm=${maxRadius}`

    console.log(query)
    axios
        .get(query)
        .then((response) => {
            res.send(response.data)
        })
        .catch((err) => {
            res.json(err)
        })
}

exports.get_earthquakes = get_earthquakes
exports.count_earthquakes = count_earthquakes
exports.avg_depth_magnitude = avg_depth_magnitude
exports.get_nearest_users = get_nearest_users
exports.get_nearest_earthquake = get_nearest_earthquake
