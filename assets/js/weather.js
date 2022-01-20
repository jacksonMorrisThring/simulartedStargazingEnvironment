//search for date and city
const searchForm = document.querySelector('#search-form');
const citySearch = document.querySelector('#city-search');
let selectedCity;
let weatherToday, weather7Day;




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
};

const init = () => {
    searchForm.addEventListener('submit', citySearchChangeHandler);
}

window.addEventListener('load',init);