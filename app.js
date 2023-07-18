const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
 
});

app.post("/", function(req, res) {
  const query = req.body.cityName;
  const apiKey = process.env.API_KEY;
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;

  https.get(url, function(response) {
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

      const htmlResponse = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>WeatherNow</title>
          <link rel="stylesheet" href="styles.css">
      </head>
      <body>
          <div class="container">
              <h1>WeatherNow</h1>
              <form action="/" method="post">
                  <input id="cityInput" type="text" name="cityName" value="${query}">
                  <button type="submit">Go</button>
              </form>
              <div class="weather-result">
                <br>
                <br>
                <h2>Weather in ${query}</h2>
                <p>The weather is currently ${weatherDescription}</p>
                <p>The temperature in ${query} is ${temp} degree Celsius.</p>
                <img src="${imageURL}" alt="Weather icon">
              </div>
          </div>
      </body>
      </html>
    `;

      res.send(htmlResponse);
    });
  });
});



app.listen(3000, function(){
  console.log("Server is running on port 3000.")
})




