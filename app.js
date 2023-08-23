require("dotenv").config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function (req, res) {
    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
    https.get(url, function (response) {

        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write("<p>The weather description is " + description + ".</p>")
            res.write("<p>The temperature in " + query + " is " + temp + " degrees.</p>");
            res.write("<img src=" + iconURL + ">");
            res.send();
        })
    })
})

app.listen(3000, function () {
    console.log("Server is running on port 3000.");
})

