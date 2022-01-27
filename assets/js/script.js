//date and city variables ----------------------------------------//

//form elements
const searchForm = document.querySelector('#search-form');
const citySearch = document.querySelector('#city-search');
const locationTxt = document.querySelector('.location-text');

//global value holders
let selectedCity = null; //user selected city
let cityLat = null;
let cityLng = null;
let cityHeight = null;
let weatherToday, weather7Day; //weather data holders
let timezone;
let offset;
let riseSetTimes = [];

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

//planet variables ----------------------------------------------//

const planets = {
    0 : 'Mercury',
    1 : 'Venus',
    2 : 'Mars',
    3 : 'Jupiter',
    4 : 'Saturn',
    5 : 'Uranus',
    6 : 'Neptune'
}

let selectedPlanet = 'Mercury';
let planet_index = 0;

//today Planet set and rise text
const riseTimeText = document.querySelector('#rise-time');
const setTimeText = document.querySelector('#set-time');


//-------------------------------------- Weather API --------------------------------------------------------------------//

//prepare data for longitude and latitude api call when city is entered
const cityWeatherSearch = name => {

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=cf0f236d99f05f78766736970398dfe2`;

    return fetch(url).then(response => {
        if(response.ok) {  
            //get data
            return response.json();
        }
    }).then(info => {
        //save name, longitude, and latitude from response
        cityLat = info.coord.lat;
        cityLng = info.coord.lon;

        return [info.name, cityLat, cityLng];
    }).then(info => {
        //call onecall api to get more detailed data
        getWeather(info[0], info[1], info[2]);
    }).catch(() => {
        weatherApiFetchErrorHandler();
    })
}


//get weather from api and update today's and 7day forcast
const getWeather = (name, lat, lng) => {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&exclude=minutely&appid=cf0f236d99f05f78766736970398dfe2`;
    
    fetch(url)
        .then(response => {
            if(response.ok) { 
                return response.json();
            }
        })
        .then(info => {
            //save todays weather and the coming weeks
            weatherToday = info.current;
            weather7Day = info.daily;
            
            //get the timezone and utc offset
            timezone = info.timezone;
            offset = info.timezone_offset;

            //save states to localStorage
            storeLocalUserPrefs('lat', lat);
            storeLocalUserPrefs('lng', lng);
            storeLocalUserPrefs('name', name);
            storeLocalUserPrefs('planet', selectedPlanet);
            storeLocalUserPrefs('planet_index', planet_index);

            //update planet data
            updatePlanets(selectedPlanet, cityLat, cityLng);

            //update weather data
            updateTodayWeather();
            updateWeeklyWeather();

            //update location text
            locationTxt.innerText = name;
            citySearch.value = "";
        }).catch(() => {
            weatherApiFetchErrorHandler();
        })
};


//error handler for failed api fetch
const weatherApiFetchErrorHandler = event => {};


//update weather in today section
//use weatherToday variable
const updateTodayWeather = () => {
    var currentrisetime = document.getElementById("rise-time");
    currentrisetime.textContent = dayjs(weatherToday.sunrise*1000).format("hh:mm A");
    var currentsettime = document.getElementById("set-time");
    currentsettime.textContent = dayjs(weatherToday.sunset*1000).format("hh:mm A");
    var currentcondition = document.getElementById("condition");
    currentcondition.textContent = `Condition: ${weatherToday.weather[0].main}`;
    var currenttemperature = document.getElementById("temperature");
    currenttemperature.textContent = `Temperature: ${weatherToday.temp} °C`;
    var currentwind = document.getElementById("wind");
    currentwind.textContent = `Wind: ${weatherToday.wind_speed} km/h`;
    var currenthumidity = document.getElementById("humidity");
    currenthumidity.textContent = `Humidity: ${weatherToday.humidity} %`;
};


//update the weather for the week
const updateWeeklyWeather = () => {
    //use weather7Day variable
    //update 7 day section
    var forecastbox = document.querySelector(".day-container");
    forecastbox.innerHTML = "";
    //update 7 day section
    for (let i=1; i<8; i++) {
        forecastbox.innerHTML +=
            `<div class="block p-6 rounded-lg shadow-lg bg-white max-w-sm mx-2">
                <h5 class="text-gray-900 text-xl leading-tight font-medium mb-2">${dayjs(weather7Day[i].dt*1000).format("DD/MM/YYYY")} ${dayjs(weather7Day[i].dt*1000).format("ddd")}</h5>
                <div class="text-gray-700 text-base mb-1 w-16">Condition:${weather7Day[i].weather[0].main}</div>
                <div class="text-gray-700 text-base mb-1 w-16">Hightemp:${weather7Day[i].temp.max} °C</div>
                <div class="text-gray-700 text-base mb-1 w-16">Lowtemp:${weather7Day[i].temp.min} °C</div>
                <div class="text-gray-700 text-base mb-1 w-16">Windspeed:${weather7Day[i].wind_speed}km/h</div>
                <div class="text-gray-700 text-base mb-1 w-16">Humidity:${weather7Day[i].humidity}%</div>
            </div>`;
    }
};



//--------------------------------------------- Planet Functions ----------------------------------------//

//parent function to handle update of planets
const updatePlanets = (planet, lat, lng) => {
    //google elevation API
    var fnRequestURL = "https://maps.googleapis.com/maps/api/elevation/json?locations="+lat+"%2C"+lng+"&key=AIzaSyBzLHUoT5HXQ28s19821jaSJxj1QBHXhpc";

    //fetch height
    fetch(fnRequestURL)
    .then (function(response){
        return response.json();
    }).then( function(data){
        //assigning an object variable to the google data object containing elevation
        var objectData = data.results[0];
        //aving elevation globally 
        cityHeight = objectData.elevation;
        //updating local Storage
        storeLocalUserPrefs('height', cityHeight);
        return;
    }).then(() => {
        //update planet rise and fall times
        updateTodayPlanet(planet);
        updateWeeklyPlanet(planet);
    })

};


//update planet rise and fall today
const updateTodayPlanet = (planet) => {

    //create new observer
    let observer = new Astronomy.Observer(cityLat, cityLng, cityHeight);

    let date = new Date();
    let newDate = getOffsetDate(date);

    //get rise and set time
    const visibleSpan = getRiseSet(planet, observer, newDate);

    console.log(visibleSpan); //error handling, delete for production

    //update page
    riseTimeText.innerText = visibleSpan.rise;
    setTimeText.innerText = visibleSpan.set;
}


//get rise and fall times for 7 days after the current day
const updateWeeklyPlanet = planet => {
    riseSetTimes = [];

    //get height of location coordinates

    //create new observer
    let observer = new Astronomy.Observer(cityLat, cityLng, cityHeight);

    for(let i = 1; i <= 7; i++) {
        let date = getOffsetDate(new Date());
        date.setDate(date.getDate() + i);
        riseSetTimes.push(getRiseSet(planet, observer, date));
    }

    return;
};


//will get Rise and Set of a planet on a day for an observer
const getRiseSet = (planet, observer, date) => {
    let visible = false;
    //set to start of day
    date.setHours(0,0,0,0);

    //get rise and set
    let rise = Astronomy.SearchRiseSet(planet, observer, 1, date ,1);
    let set = Astronomy.SearchRiseSet(planet, observer, -1, date ,1);

    //if the set time is before the rise time, get the next set time
    if(rise.date > set.date) {
        date = rise.date;
        set = Astronomy.SearchRiseSet(planet, observer, -1, date ,1);
    }

    //see if planet is currently visible
    const dateNow = getOffsetDate(new Date());
    if((rise.date < dateNow) && (dateNow < set.date)) {
        visible = true;
    }

    //format string -> hh:mm AM/PM
    rise = dayjs(rise.date).format('hh:mm A dd');
    set = dayjs(set.date).format('hh:mm A dd');

    return {rise: rise, set: set, visible: visible};
}


//helper function to offest javascript date object to the correct timezone of searched city
const getOffsetDate = date => {
    let newDate = dayjs(date).utc();
    newDate.utcOffset(offset/60);
    return newDate.$d;
}



//--------------------------------------- Form Handlers ---------------------------------------------------//

//location form submit handler 
const citySearchChangeHandler = event => {
    event.preventDefault();
    selectedCity = citySearch.value;
    cityWeatherSearch(selectedCity);
};


//planet change handler
const planetChangeHandler = planet => {
    //set planet
    selectedPlanet = planets[planet];
    storeLocalUserPrefs('planet', selectedPlanet);
    storeLocalUserPrefs('planet_index', planet);

    if(selectedCity === null) {
        console.log('please set location');
        return;
    }

    //update planet rise and fall data
    updatePlanets(selectedPlanet, cityLat, cityLng);
}


//--------------------------------------------- Planet Carousel -------------------------------------------------//

//planet carousel
var flkty = new Flickity(".main-carousel", {
    // options
    wrapAround: true,
    adaptiveHeight: true,
    on: {
        change: (index) => {
            planetChangeHandler(index);
        },
    },
});



//----------------------------------------------- Local Storage ------------------------------------------------//

//store a key value pair in the userPrefs local storage key
const storeLocalUserPrefs = (key, value) => {
    //get from local storage
    let local = getLocalUserPrefs();
    //update keys
    local[key] = value;
    //store to local storage
    local = JSON.stringify(local);
    localStorage.setItem('userPrefs', local);
};


//get userPrefs from local storage
const getLocalUserPrefs = () => {
    let local = JSON.parse(localStorage.getItem('userPrefs'));

    if(local) {
        return local;
    }

    return {name: null, lat: null, lng: null, height: null, planet: null, planet_index: null};
};


//page initialization of weather and planet values
const pageInit = () => {
    //get local storage data
    let local = getLocalUserPrefs();

    //if all needed data is initialized
    if((local['lat'] != null) && (local['planet'] != null)) {

        //use local data to update current global values
        selectedCity = local.name;
        cityLat = local.lat;
        cityLng = local.lng;
        selectedPlanet = local.planet;
        planet_index = local.planet_index;
        cityHeight = local.height;

        //set carousel to the correct planet
        flkty.select( planet_index );

        //update the page with new information (weather, rise and fall)
        cityWeatherSearch(selectedCity);
    }
};


//page initialization
const init = () => {
    pageInit();
    searchForm.addEventListener('submit', citySearchChangeHandler);
}


//listener for page load
window.addEventListener('load',init);