//date and city variables ----------------------------------------//

//Page Sections
const todaySection = document.querySelector('#results-today-nav');
const weeklySection = document.querySelector('#day-nav');
const savedDates = document.querySelector('.saved-dates');

//Navbar elements
const menuBtn = document.querySelector('#menu-toggle');
const menuBtnImg = document.querySelector('#menu-toggle-img');
const navLinks = document.querySelector('#nav-links');

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
            let promise = updatePlanets(selectedPlanet, cityLat, cityLng);

            //update weather data
            promise.then(response => {
                if(response === "success") {

                    updateTodayWeather();
                    updateWeeklyWeather();

                    todaySection.classList.remove('hidden');
                    weeklySection.classList.remove('hidden');
                } else {
                    console.log('please try again');
                }
            });
            

            //update location text
            locationTxt.innerText = name;
            citySearch.value = "";
        })
        .catch(() => {
            weatherApiFetchErrorHandler();
        })
};


//error handler for failed api fetch
const weatherApiFetchErrorHandler = event => {};


//update weather in today section
//use weatherToday variable
const updateTodayWeather = () => {
    let currentcondition = document.getElementById("condition");
    currentcondition.innerHTML = `<span>Condition:</span><span>${weatherToday.weather[0].main}</span>`;
    let currenttemperature = document.getElementById("temperature");
    currenttemperature.innerHTML = `<span>Temperature:</span><span>${weatherToday.temp} °C</span>`;
    let currentwind = document.getElementById("wind");
    currentwind.innerHTML = `<span>Wind:</span><span>${weatherToday.wind_speed} km/h</span>`;
    let currenthumidity = document.getElementById("humidity");
    currenthumidity.innerHTML = `<span>Humidity:</span><span>${weatherToday.humidity} %</span>`;
};


//update the weather for the week
const updateWeeklyWeather = () => {
    //use weather7Day variable
    //update 7 day section
    let forecastbox = document.querySelector(".day-container");
    forecastbox.innerHTML = "";
    //update 7 day section
    for (let i=1; i<6; i++) {
        forecastbox.innerHTML +=
            `<article class="w-full lg:w-auto flex-grow p-5 pt-0 rounded-lg shadow-lg bg-indigo-500" data-card-number="${i-1}">
                <section class="flex justify-between items-center">
                    <h3 id="date${i-1}" class="text-white text-xl leading-tight font-medium mb-2 text-bold whitespace-nowrap">${dayjs(weather7Day[i].dt*1000).format("ddd")} ${dayjs(weather7Day[i].dt*1000).format("MMM D, YYYY")} </h5>
                    <img id="icon${i-1}" data-icon="${weather7Day[i].weather[0].icon}" src="http://openweathermap.org/img/wn/${weather7Day[i].weather[0].icon}@2x.png">
                </section>
                <section>
                    <h4 class="text-white font-bold mb-2">Planet</h4>
                    <div class="flex justify-between text-gray-200 mb-6 text-sm"><span>Rise:</span><span id="rise${i-1}">${riseSetTimes[i-1].rise}</span></div>
                    <div class="flex justify-between text-gray-200 mb-6 text-sm"><span>Set:</span><span id="set${i-1}">${riseSetTimes[i-1].set}</span></div>
                </section>
                <section>
                    <h4 class="text-white font-bold mb-2">Weather<h4>
                    <div class="flex justify-between text-gray-200 mb-6 text-sm"><span>Condition:</span> <span id="condition${i-1}">${weather7Day[i].weather[0].main}</span></div>
                    <div class="flex justify-between text-gray-200 mb-6 text-sm"><span>Hightemp:</span> <span>${weather7Day[i].temp.max} °C</span></div>
                    <div class="flex justify-between text-gray-200 mb-6 text-sm"><span>Lowtemp:</span> <span>${weather7Day[i].temp.min} °C</span></div>
                    <div class="flex justify-between text-gray-200 mb-6 text-sm"><span>Windspeed:</span> <span>${weather7Day[i].wind_speed} km/h</span></div>
                    <div class="flex justify-between text-gray-200 mb-6 text-sm"><span>Humidity:</span> <span>${weather7Day[i].humidity}%</span></div>
                </section>
                <section>
                    <button class="w-full py-2 bg-slate-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" onClick="saveDate(this)">Save Date</button>
                </section>
                
            </article>`;
    }

};





//--------------------------------------------- Planet Functions ----------------------------------------//

//parent function to handle update of planets
const updatePlanets = (planet, lat, lng) => {
    //open elevation API
    
    var fnRequestURL = `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`;

    //fetch height
    return fetch(fnRequestURL)
    .then (function(response){
        if(response.ok) {
            return response.json();
        }
    }).then( function(data){
        //saving elevation globally 
        cityHeight = data.results[0].elevation;
        //updating local Storage
        storeLocalUserPrefs('height', cityHeight);

        updateTodayPlanet(planet);
        updateWeeklyPlanet(planet);
        return 'success';
    }).catch(() => {
        return 'failed';
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

//--------------------------------------- Save Date -------------------------------------------------------//
const getUniqueId = () => {
    let id = Math.random();
    let local = getLocalDates();

    local.forEach(element => {
        if(element.id === id) {
            return getUniqueId();
        }
    });

    return id;
}

const createCard = (weather, icon, rise, set, date, planet, city, id) => {

    let article = document.createElement('article');
    article.className = 'flex flex-col gap-4 w-full lg:w-auto flex-grow p-5 pt-0 rounded-lg shadow-lg bg-indigo-500';
    article.setAttribute('id', `${id}`);

    let dateHeader = document.createElement('section');
    dateHeader.className = 'flex justify-between items-center';

    let dateText = document.createElement('h3');
    dateText.className = 'text-white text-xl leading-tight font-medium mb-2 text-bold whitespace-nowrap';
    dateText.innerText = date;

    let weatherImg = document.createElement('img');
    weatherImg.setAttribute('src', `http://openweathermap.org/img/wn/${icon}@2x.png`);

    
    let planetDiv = document.createElement('p');
    planetDiv.className = 'flex justify-between text-gray-200';
    planetDiv.innerHTML = `<span>Planet:</span><span>${planet}</span>`;

    let locationDiv = document.createElement('p');
    locationDiv.className = 'flex justify-between text-gray-200';
    locationDiv.innerHTML = `<span>Location:</span><span>${city}</span>`;

    let weatherDiv = document.createElement('p');
    weatherDiv.className = 'flex justify-between text-gray-200';
    weatherDiv.innerHTML = `<span>Condition:</span><span>${weather}</span>`;

    let riseDiv = document.createElement('p');
    riseDiv.className = 'flex justify-between text-gray-200';
    riseDiv.innerHTML = `<span>Rise:</span><span>${rise}</span>`;

    let setDiv = document.createElement('p');
    setDiv.className = 'flex justify-between text-gray-200';
    setDiv.innerHTML = `<span>Set:</span><span>${set}</span>`;

    let deleteButton = document.createElement('button');
    deleteButton.className = 'w-full mt-8 py-2 bg-slate-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out'
    deleteButton.setAttribute('onClick', 'deleteCard(this)');
    deleteButton.innerText = 'Delete';

    dateHeader.append(dateText, weatherImg);
    article.append(dateHeader, locationDiv, weatherDiv, planetDiv, riseDiv, setDiv, deleteButton);

    return article;
};

const deleteCard = target => {
    console.log(target.parentElement.id);
    let id = target.parentElement.id;
    removeFromLocalDates(id);
    target.parentNode.remove();
};

const saveDate = target => {
    
    let parent = target.parentNode.parentNode;
    let card = parent.dataset.cardNumber;
    let weather = document.querySelector(`#condition${card}`).innerText;
    let rise = document.querySelector(`#rise${card}`).innerText;
    let set = document.querySelector(`#set${card}`).innerText;
    let date = document.querySelector(`#date${card}`).innerText;
    let icon = document.querySelector(`#icon${card}`).dataset.icon;
    
    let id = getUniqueId();
    console.log(id);

    let newCard = createCard(weather, icon, rise, set, date, selectedPlanet, selectedCity, id);
    savedDates.append(newCard);

    storeLocalDates(weather, icon, rise, set, date, selectedPlanet, selectedCity, id);
};

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
    let promise = updatePlanets(selectedPlanet, cityLat, cityLng);
    promise.then(() => {
        updateWeeklyWeather();
    })
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


//store date to local storage
const storeLocalDates = (weather, icon, rise, set, date, planet, city, id) => {
    //get from local storage
    let local = getLocalDates();
    //push date
    local.push({weather: weather, icon: icon, rise: rise, set: set, date: date, planet: planet, city: city, id: id})
    //store to local storage
    local = JSON.stringify(local);
    localStorage.setItem('savedDates', local);
};


//get saved dates from local storage
const getLocalDates = () => {
    let local = JSON.parse(localStorage.getItem('savedDates'));

    if(local) {
        return local;
    }

    return [];
};


//remove date from local storage
const removeFromLocalDates = id => {
    let local = getLocalDates();

    for(let i = 0; i < local.length; i++) {
        if(local[i].id == id) {
            local.splice(i, 1);
            break;
        }
    }
    
    localStorage.setItem('savedDates', JSON.stringify(local));

    return;
};

//-------------------------------- Navbar -------------------------------------------------------//

const toggleMenu = () => {
    let status = menuBtn.value;

    if(status === "closed") {
        menuBtn.value = "open";
        navLinks.classList.remove('hidden');
        menuBtnImg.setAttribute('src', './assets/images/icons/menu-close.svg');
    } else {
        menuBtn.value = "closed";
        navLinks.classList.add('hidden');
        menuBtnImg.setAttribute('src', './assets/images/icons/menu-open.svg');
    }
};
//-------------------------------- Page Initilization -------------------------------------------//

//page initialization of weather and planet values
const pageInit = () => {
    //get local storage data
    let prefs = getLocalUserPrefs();
    let dates = getLocalDates();

    //if all needed data is initialized
    if((prefs['lat'] != null) && (prefs['planet'] != null)) {

        //use local data to update current global values
        selectedCity = prefs.name;
        cityLat = prefs.lat;
        cityLng = prefs.lng;
        selectedPlanet = prefs.planet;
        planet_index = prefs.planet_index;
        cityHeight = prefs.height;

        //set carousel to the correct planet
        flkty.select( planet_index );

        //update the page with new information (weather, rise and fall)
        cityWeatherSearch(selectedCity);
    }

    //if there are any saved dates
    if(dates.length > 0) {
        //create document fragment
        const fragment = new DocumentFragment();
        //iterate through dates and create a card for each of them and append to fragment
        for(let i = 0; i < dates.length; i++) {
            let card = createCard(dates[i].weather, dates[i].icon, dates[i].rise, dates[i].set, dates[i].date, dates[i].planet, dates[i].city, dates[i].id);
            fragment.append(card);
        }
        //append fragment to page
        savedDates.append(fragment);
    }

};


//page initialization
const init = () => {
    pageInit();
    searchForm.addEventListener('submit', citySearchChangeHandler);
}


//listener for page load
window.addEventListener('load',init);