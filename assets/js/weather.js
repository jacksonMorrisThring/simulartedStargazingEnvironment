//search for date and city
const searchForm = document.querySelector('#search-form');
const citySearch = document.querySelector('#city-search');
let selectedCity;
let weatherToday, weather7Day;

const nextBtn = document.querySelector('#planet-next');
const prevBtn = document.querySelector('#planet-prev');

let selectedPlanet = 0;



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
        const lat = info.coord.lat;
        const lng = info.coord.lon;

        return [name, lat, lng];
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
            console.log(info);
            weatherToday = info.current;
            weather7Day = info.daily;
        }).catch(() => {
            weatherApiFetchErrorHandler();
        })
};

//error handler for failed api fetch
const weatherApiFetchErrorHandler = event => {};

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

    //calculate rise and fall time for today,
    updateTodayPlanet();
    //and each day next week
    updateWeeklyPlanet();
}

//update weather in today section
//use weatherToday variable
const updateTodayWeather = () => {

};

//update the weather for the week
const updateWeeklyWeather = () => {
    //use weather7Day variable
    //update 7 day section
};

//update planet rise and fall today
const updateTodayPlanet = () => {
    //use planet functions to get rise and fall

    //update page
}

const updateWeeklyPlanet = () => {
    //use planet functions

    //update rise and fall for each day of the week
};


//planet selector
const planetImages = [
    './assets/images/planets/1-Mercury.png',
    './assets/images/planets/2-Venus.png',
    './assets/images/planets/3-Earth.png',
    './assets/images/planets/4-Mars.png',
    './assets/images/planets/5-Jupiter.png',
    './assets/images/planets/6-Saturn.png',
    './assets/images/planets/7-Uranus.png',
    './assets/images/planets/8-Neptune.png',
]

const planets = {
    0 : 'Mercury',
    1 : 'Venus',
    2 : 'Mars',
    3 : 'Jupiter',
    4 : 'Saturn',
    5 : 'Uranus',
    6 : 'Neptune'
}

var flkty = new Flickity( '.main-carousel', {
    // options
    wrapAround: true,
    adaptiveHeight: true,
    on: {
        change: (index) => {
            planetChangeHandler(index);
        },
    },
  });

const init = () => {
    searchForm.addEventListener('submit', citySearchChangeHandler);
    //add in listener for planet change
}

window.addEventListener('load',init);