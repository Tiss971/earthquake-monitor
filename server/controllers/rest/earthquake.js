const axios = require("axios");

function get_earthquakes (req, res) {
    var time = req.params.time;
    var magnitude = req.params.magnitude;

    const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/'
    const query = `${url}${time}_${magnitude}.geojson`
    axios.get(query)
    .then(response => {
        res.send(response.data);
    })
    .catch(err => {
        res.json(err)
    })
}

exports.get_earthquakes = get_earthquakes

