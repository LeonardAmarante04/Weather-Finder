// Api keys
const encryptedKey1 = btoa(`2294cc450dbd115f9a7714ec9ec6a4cd`);
const weather_api_key = atob(encryptedKey1);
const APIusername = "LeonardA04";
const encryptedKey2 = btoa(`c68313b38a284dbd97bc3eace0c05ca4`);
const geonamesAPi = atob(encryptedKey2);

// DOOM ELEMENTS
const userInput = document.getElementById("userInput");
const autocompleteHolder = document.getElementById("autocompleteHolder");
const lookingText = document.getElementById("lookingText");
const submitInput = document.getElementById("submitInput");
const mainWeatherHolder = document.getElementById("mainWeatherHolder");
const daysWeather = document.getElementById("daysWeather");
const infoVisibility = document.getElementById("infoVisibility");
// global variables for storing weather information and styles

let weatherData, forecastWeatherData, weatherDiv_created = false, weatherDate,
    weathertemp, maxMin_temp, iconImg, srt, weatherDescription, cityHours,
    sunDownHour, sunUpHour, backgroundColor, backgroundImage, weatherdivHolders,
    cityChoicesButton, chosecity, geosaveData, autocompleteData, buttonPressed = false;



// auto completer!
userInput.addEventListener("input", function () {
    userinputVal = userInput.value


    if (userinputVal.length >= 2) {

        async function geonames() {


            const geonameResponse = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${userinputVal}&apiKey=${geonamesAPi}`);
            geoData = await geonameResponse.json();
            autocompleteData = geoData;
            console.log(autocompleteData)
            for (let i = 0; i < autocompleteData.features.length; i++) {


                document.getElementById(`autocompleter${i}`).innerText = `${autocompleteData.features[i].properties.formatted}`
                document.getElementById("autocompleteHolder").style.display = "block";
                document.getElementById("lookingText").style.display = "none";


                const buttons = document.querySelectorAll('button'); // Selects all button elements

                buttons.forEach(button => {
                    if (button.textContent === 'undefined') {
                        button.textContent = '';
                    }
                });


                document.getElementById(`autocompleter${i}`).addEventListener("click", function () {
                    userInput.value = document.getElementById(`autocompleter${i}`).innerText;
                    buttonPressed = true
                    setTimeout(() => {
                        buttonPressed = false;
                    }, 2000);
                    lat = autocompleteData.features[i].properties.lat
                    lon = autocompleteData.features[i].properties.lon


                });


            }
            if (!buttonPressed) {
                lat = autocompleteData.features[0].properties.lat
                lon = autocompleteData.features[0].properties.lon
            }

        };

        geonames()

    }


});



document.querySelector('body').addEventListener('click', function () {
    document.getElementById("autocompleteHolder").style.display = "none";
    document.getElementById("lookingText").style.display = "block";
});




// click event listener for submit button
submitInput.addEventListener("click", function () {
    
// sets display to autocomplete holder to none
document.getElementById("autocompleteHolder").style.display = "none";

    // temperature unit conditions & storage values into variables
    const userCity = userInput.value
    const fUnit = document.getElementById("f-unit");
    const cUnit = document.getElementById("c-unit");
    let unit;
    let unitSymbol;



    // if userInput is empty or is  a number than aler user "please write a city!"
    if (!userCity || !isNaN(userCity)) {
        alert("please write a city!")
    }
    // if funit radio button is checked than set values for the unit and unitSymbol variables
    if (fUnit.checked) {
        unit = "imperial"
        unitSymbol = "F°"
    }

    // if cunit radio button is checked than set values for the unit and unitSymbol variables
    if (cUnit.checked) {
        unit = "metric"
        unitSymbol = "C°"
    }

    // if funit radio and cUnit button radio is not checked than alert user 'Please choose a temperature unit!'
    if (!fUnit.checked && !cUnit.checked) {
        alert("Please choose a temperature unit!")
    }
    else {

        // fetchWeatherData async function!
        async function fetchWeatherdata() {



            try {


                // Geo API DATA FETCH & MANIPULATION
                const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weather_api_key}&units=${unit}`);
                weatherData = await weatherResponse.json();
                weatherDescription = weatherData.weather[0].main;


                // gets sunset data from weatherData API
                const sundownUnix = weatherData.sys.sunset
                // gets sunrise data from weatherData API
                const sunupUnix = weatherData.sys.sunrise

                // five day weather forecast API DATA FETCH & MANIPULATION
                const forecastWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weather_api_key}&units=${unit}`);
                forecastWeatherData = await forecastWeatherResponse.json()



                // timezone API DATA FETCH & MANIPULATION
                const timezoneResponse = await fetch(`https://secure.geonames.org/timezoneJSON?lat=${lat}&lng=${lon}&username=${APIusername}`);

                const timezoneData = await timezoneResponse.json();
                // gets the date and time data of timezone API
                const cityTime = timezoneData.time;
                // filters cityTime string value between a start value and a end value which is the new value of the cityHours variable
                cityHours = cityTime.substring(11, 13);
                // converts the sunset unix value into a readable format 
                const sundownTime = new Date(sundownUnix * 1000).toLocaleTimeString("en-GB", { timeZone: `${timezoneData.timezoneId}` })
                // converts the sunrise unix value into a readable format 
                const sunupTime = new Date(sunupUnix * 1000).toLocaleTimeString("en-GB", { timeZone: `${timezoneData.timezoneId}` })
                // filters sunDownHour string value between a start value and a end value which is the new value of the sunDownHour variable
                sunDownHour = sundownTime.substring(0, 2);
                // filters sunUpHour string value between a start value and a end value which is the new value of the sunUpHour variable
                sunUpHour = sunupTime.substring(0, 2);




                // CONDITIONS FOR SUNSET AND SUNRISE
                if (Number(cityHours) >= Number(sunDownHour) || Number(cityHours) <= Number(sunUpHour)) {
                    document.getElementById("weatherIcon").src = "./assets/moonIcon.png";
                    document.getElementById("weatherIcon").style.width = "50px";
                    document.getElementById("weatherIcon").style.height = "50px";
                    backgroundColor = `rgb(11,11,11)`;
                    backgroundImage = `url(./assets/nightStars.jpeg)`;


                    const weatherMessages = {
                        "Clouds": `./assets/weatherVideos/nightClouds.mp4`,
                        "Clear": `./assets/weatherVideos/clearNight.mp4`,
                        "Snow": `./assets/weatherVideos/snowfix.mp4`,
                        "Rain": `./assets/weatherVideos/nightRain.mp4`,
                        "Thunderstorm": `./assets/weatherVideos/thunderstorm.mp4`

                    }

                    if (weatherMessages[weatherDescription]) {
                        document.getElementById("background-video").src = weatherMessages[weatherDescription];



                    }

                    else {
                        console.log("Weather description not found.");
                    }
                }




                // CONDITION FOR SUNRISE
                else {

                    // when is the sun is out change the source  for main icon to sun-image
                    document.getElementById("weatherIcon").src = "./assets/sun-image.png";
                    backgroundColor = ` #0093E9`;
                    backgroundImage = `linear-gradient(90deg, #0093E9 0%, #80D0C7 100%)`


                    // weatherMessages object with weather description key names and values!
                    const weatherMessages = {
                        "Clouds": `./assets/weatherVideos/dayCloud.mp4`,
                        "Clear": `./assets/weatherVideos/clearSky.mp4`,
                        "Snow": `./assets/weatherVideos/snowfix.mp4`,
                        "Rain": `./assets/weatherVideos/rain.mp4`,
                        "Thunderstorm": `./assets/weatherVideos/thunderstorm.mp4`
                    };


                    // condition for changing the background document.getElementById("background-video") source according to the weather description
                    if (weatherMessages[weatherDescription]) {
                        document.getElementById("background-video").src = weatherMessages[weatherDescription];


                    }


                    // if  weather description 
                    else {
                        console.log("Weather description not found.");
                    }
                }


                // current temperature section
                const mainIcon = document.createElement("img");
                // icon weather for forecast div
                mainIcon.src = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;


                document.getElementById("cityName").textContent = weatherData.name;
                document.getElementById("cityName").appendChild(mainIcon)
                document.getElementById("temperature").textContent = `Temperature: ${Math.floor(weatherData.main.temp)}${unitSymbol}`
                document.getElementById("max-min-temp").textContent = `Min-temp: ${Math.floor(weatherData.main.temp_min)}${unitSymbol}  Max-temp: ${Math.floor(weatherData.main.temp_max)}${unitSymbol}`


                // divs styles
                document.getElementById("mainWeatherHolder").style.backgroundImage = backgroundImage;
                document.getElementById("mainWeatherHolder").style.backgroundPosition = "center";
                document.getElementById("mainWeatherHolder").style.backgroundSize = "cover";
                document.getElementById("mainWeatherHolder").backgroundColor = backgroundColor;
                document.getElementById("mainWeatherHolder").style.border = `2px solid ${backgroundColor}`;


                // ARRAY THAT STORES SPECIFIC OBJECTS FROM FORECAST API
                const fiveDayWeather = [forecastWeatherData.list[4], forecastWeatherData.list[12], forecastWeatherData.list[20], forecastWeatherData.list[28], forecastWeatherData.list[36]]




                // CONDITION FOR WHEN WEATHER DIVS FOR FORECAST ARE CREATED
                if (!weatherDiv_created) {
                    for (let i = 0; i < 5; i++) {

                        // creates div elements to holde the information of each 5 days weather boardcast
                        weatherdivHolders = document.createElement("div");
                        weatherdivHolders.className = "col-lg-2 white-color";
                        // STYLES FOR WEATHER DIVS FORECAST
                        weatherdivHolders.style.backgroundColor = backgroundColor;
                        weatherdivHolders.style.backgroundImage = backgroundImage;
                        weatherdivHolders.style.backgroundSize = "cover";
                        weatherdivHolders.style.position = "center";
                        weatherdivHolders.style.border = `2px solid ${backgroundColor}`;
                        weatherdivHolders.style.borderRadius = "10px";
                        weatherdivHolders.style.marginLeft = "15px";
                        weatherdivHolders.style.marginTop = "10px";
                        // appending the weatherdivholders
                        document.getElementById("daysWeather").appendChild(weatherdivHolders)

                        // creates text elements for the use of displaying the 5 days boardcast
                        weatherdivHolders.id = `weatherDivHolder${i}`;
                        weatherDate = document.createElement("h3");
                        weathertemp = document.createElement("h4");
                        maxMin_temp = document.createElement("h6");
                        iconImg = document.createElement("img");

                        // adds a class to elements for sizes
                        weatherDate.className = "fs-4";
                        weathertemp.className = "fs-5";
                        maxMin_temp.className = "fs-6";



                        // sets eid's for targeting the weatherDate elements
                        weatherDate.id = `weatherDate${i}`;
                        weathertemp.id = `weatherTemp${i}`;
                        maxMin_temp.id = `maxMinTemp${i}`;

                        // adds the text content of the text elements that shows the api information of the weather during 5 days
                        iconImg.src = `http://openweathermap.org/img/wn/${fiveDayWeather[i].weather[0].icon}.png`;
                        srt = fiveDayWeather[i].dt_txt;
                        weatherDate.textContent = srt.substring(0, 10);
                        weatherDate.appendChild(iconImg);
                        weathertemp.textContent = `Temperature: ${Math.floor(fiveDayWeather[i].main.temp)}${unitSymbol}`;
                        maxMin_temp.textContent = `Wind Speed: ${fiveDayWeather[i].wind.speed}`;
                        weatherdivHolders.append(weatherDate, weathertemp, maxMin_temp);


                    }
                    // sets the creation of the divs equal to true
                    weatherDiv_created = true;
                }

                else {


                    // if divs are created than just change the contenct of the elements already created  
                    for (let q = 0; q < 5; q++) {

                        document.getElementById(`weatherDivHolder${q}`).style.backgroundColor = backgroundColor;
                        document.getElementById(`weatherDivHolder${q}`).style.backgroundImage = backgroundImage;
                        document.getElementById(`weatherDivHolder${q}`).style.border = `solid 2px ${backgroundColor}`;
                        iconImg = document.createElement("img");
                        srt = fiveDayWeather[q].dt_txt
                        iconImg.src = `http://openweathermap.org/img/wn/${fiveDayWeather[q].weather[0].icon}.png`;
                        document.getElementById(`weatherDate${q}`).textContent = srt.substring(0, 10);
                        document.getElementById(`weatherDate${q}`).appendChild(iconImg);
                        document.getElementById(`weatherTemp${q}`).textContent = `Temperature: ${Math.floor(fiveDayWeather[q].main.temp)}${unitSymbol}`;
                        document.getElementById(`maxMinTemp${q}`).textContent = `Wind Speed: ${fiveDayWeather[q].wind.speed}`;


                    }
                }
                // changes the display to visiable for the main weather information div & the 5 days boardcast
                document.getElementById("infoVisibility").style.display = "block";


            }

            catch (error) {
                alert(error);

            }
        }

        fetchWeatherdata()
    }



});

