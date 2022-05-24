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
function count_earthquakes (req, res) {
    const range = req.params.range;
    const magnitude = req.params.magnitude;

    const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/'
    const query = `${url}${magnitude}_${range}.geojson`
    axios.get(query)
    .then(response => {
        var data = response.data.features;
        var timestamp = data.map(item => item.properties.time);
        timestamp.sort(function(a, b){return a-b});
        // create array with number of occurences by day
        const count = {};
        for (var i = 0; i < timestamp.length; i++) {
            var current = new Date(timestamp[i]);
            let key = null;
            switch (range) {
                case 'day':  
                    key = current.toLocaleString(undefined, {hour: '2-digit'}); 
                    break;
                case 'week':
                    key = current.toLocaleString(undefined, {weekday: 'short', day: '2-digit', month: '2-digit'});
                    break;
                case 'month':
                    key = current.toLocaleString(undefined, {month: 'short', day: '2-digit'});
                    break;
                default:
                    return
            }
            if (key in count) {
                count[key]++;
            }
            else {
                count[key] = 1;
            }
        }
        res.send({ok: true, count});
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
exports.count_earthquakes = count_earthquakes
exports.get_nearest_users = get_nearest_users

