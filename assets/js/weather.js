
//date and city variables ----------------------------------------//

//form elements
const searchForm = document.querySelector('#search-form');
const citySearch = document.querySelector('#city-search');

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
const cityWeatherSearch = (name) => {

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

        return [name, cityLat, cityLng];
    }).then(info => {
        //call onecall api to get more detailed data
        getWeather(info[0], info[1], info[2]);
        updateTodayPlanet(selectedPlanet);
        updateWeeklyPlanet(selectedPlanet);
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
            console.log(info);
            weatherToday = info.current;
            weather7Day = info.daily;
            
            timezone = info.timezone;
            offset = info.timezone_offset;

            storeLocalUserPrefs('lat', lat);
            storeLocalUserPrefs('lng', lng);
            storeLocalUserPrefs('name', name);
        }).catch(() => {
            weatherApiFetchErrorHandler();
        })
};

//error handler for failed api fetch
const weatherApiFetchErrorHandler = event => {};

//update weather in today section
//use weatherToday variable
const updateTodayWeather = () => {
    console.log(weather7Day);
};

//update the weather for the week
const updateWeeklyWeather = () => {
    console.log(weather7Day);
    //use weather7Day variable
    //update 7 day section
    var forecastbox = document.querySelector(".day-container");
    //update 7 day section
    for (let i=1; i<8; i++) {
        forecastbox.innerHTML +=
            `<div class="block p-6 rounded-lg shadow-lg bg-white max-w-sm mx-10">
                <h5 class="text-gray-900 text-xl leading-tight font-medium mb-2">${weather7Day[i].dt}</h5>
                <div class="text-gray-700 text-base mb-4 w-28">Condition:${weather7Day[i].weather[0].main}</div>
                <div class="text-gray-700 text-base mb-4 w-28">Hightemp:${weather7Day[i].temp.max}</div>
                <div class="text-gray-700 text-base mb-4 w-28">Lowtemp:${weather7Day[i].temp.min}</div>
                <div class="text-gray-700 text-base mb-4 w-28">Windspeed:${weather7Day[i].wind_speed}km/h</div>
                <div class="text-gray-700 text-base mb-4 w-28">Humidity:${weather7Day[i].humidity}%</div>
            </div>`;
    }
};


//--------------------------------------------- Planet Functions ----------------------------------------//

//update planet rise and fall today
const updateTodayPlanet = (planet) => {

    //get height of location coordinates
    setHeight(cityLat, cityLng);
    console.log(cityHeight);
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

const updateWeeklyPlanet = planet => {
    riseSetTimes = [];

    //get height of location coordinates
    setHeight(cityLat, cityLng);

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
    date.setUTCHours(0);

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

const getOffsetDate = date => {
    let newDate = dayjs(date).utc();
    newDate.utcOffset(offset/60);
    return newDate.$d;
}
//This function will be used to get the height at certain coordinates
//however this fetch will require some keys for a google api which are unsafe to chuck around during development
//so for now it is just hardcoded, should be fine
const setHeight = (lat, lng) => {
    var fnRequestURL = "https://maps.googleapis.com/maps/api/elevation/json?locations="+lat+"%2C"+lng+"&key=AIzaSyBzLHUoT5HXQ28s19821jaSJxj1QBHXhpc";

    fetch(fnRequestURL)
    .then (function(response){
        return response.json();
    })

    .then( function(data){

        //assigning an object variable to the google data object containing elevation
        var objectData = data.results[0];
        storeLocalUserPrefs('height', objectData.elevation);
        cityHeight = objectData.elevation;
    })

};

//--------------------------------------- Form Handlers ---------------------------------------------------//

//form submit handler 
const citySearchChangeHandler = event => {
    event.preventDefault();
    selectedCity = citySearch.value;
    cityWeatherSearch(selectedCity);

    //update pages
    updateTodayWeather();
    updateWeeklyWeather();
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

    //calculate rise and fall time for today,
    updateTodayPlanet(selectedPlanet);
    //and each day next week
    updateWeeklyPlanet(selectedPlanet);
}

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
const storeLocalUserPrefs = (key, value) => {
    //get from local storage
    let local = getLocalUserPrefs();
    //update keys
    local[key] = value;
    //store to local storage
    local = JSON.stringify(local);
    localStorage.setItem('userPrefs', local);
};

const getLocalUserPrefs = () => {
    let local = JSON.parse(localStorage.getItem('userPrefs'));

    if(local) {
        return local;
    }

    return {name: null, lat: null, lng: null, height: null, planet: null, planet_index: null};
};

const pageInit = () => {
    let local = getLocalUserPrefs();

    if(local['lat'] != null) {
        selectedCity = local.name;
        cityLat = local.lat;
        cityLng = local.lng;
        selectedPlanet = local.planet;
        planet_index = local.planet_index;
        cityHeight = local.height;
        flkty.select( planet_index );

        cityWeatherSearch(selectedCity);

        updateTodayPlanet(selectedPlanet);
        updateWeeklyPlanet(selectedPlanet);
    }
};


//page initialization
const init = () => {
    pageInit();
    searchForm.addEventListener('submit', citySearchChangeHandler);
}

window.addEventListener('load',init);