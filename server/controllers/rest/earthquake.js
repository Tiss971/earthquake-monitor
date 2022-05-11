const axios = require("axios");
var User = require('../../database/models/user') 

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

function get_nearest_users (req, res) {
    var latitude = req.params.latitude;
    var longitude = req.params.longitude;
    User.find({
        public:true,
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [latitude,longitude]
                }
            }
        }
    }
    ,'_id username image location lastVisit'
    , function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    })
    .limit(5);
}

exports.get_earthquakes = get_earthquakes
exports.get_nearest_users = get_nearest_users

