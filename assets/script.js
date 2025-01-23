let city = document.getElementById("userInput")
let weatherData;
let lat;
let lon;

function findWeather() {

  if (!city.value || !isNaN(city.value)) {
    alert("please write an name of a city.value");
  }

  else {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city.value}&limit=5&appid=2294cc450dbd115f9a7714ec9ec6a4cd`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const dataValues = Object.keys(data).length;  // Handle the data from OpenWeatherMap

        if (dataValues == 0) {
          console.log("invalid city.value name!");
        }
        else {
          lat = data[0].lat
          lon = data[0].lon
          console.log(data)

          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=2294cc450dbd115f9a7714ec9ec6a4cd&units=imperial`)
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              weatherData = data
              console.log(weatherData)
            })
        }

      })
      .catch(error => {
        console.error('Error fetching data:', error);  // Handle errors


      });

  }
 
  
};




