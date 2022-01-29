# Simulated Stargazing Environment
This website will use weather and solar system server-side apis to access and display planet positions for star gazing.

## User story 
```
AS AN astronomer 
I WANT to be able to access a website that showcases planet visibility
SO THAT when I select a planet
I WANT to be able to know if its the 
-> right time
-> right season
-> right weather
SO THAT I can know if I can make an observation of a planet on a particular night
```

## About The Project
Users can find out what planets are visible, and available to view. UI allows users to type in a location and select a planet. From there a user can see the rise and set times for the planets in their area as well as the weather, to decide when to plan their astronomy adventures.

### Built with:
Styling
* [Tailwind css framework](https://tailwindcss.com/)

Js libraries
* [Day.js](https://day.js.org/)
* [Flickity.js](https://flickity.metafizzy.co/)
* [Astronomy Engine](https://github.com/cosinekitty/astronomy)

Server Side API’s
* [OpenWeatherMap](https://openweathermap.org/)
* [Google Maps API Elevation service](https://developers.google.com/maps/documentation/elevation/overview)


## Getting Started
This is an example of how you may give instructions on setting up your project locally. To get a local copy up and running follow these simple example steps


Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources

## Contacts
or credits can be added here 


### Instructions:
* Navigate to planet you want to observe
* program checks planets availability (rise/fall time + seasonal availability)
* program checks weather
* if all of the above passes, will list as available. Otherwise it will display and appropriate error message

## Usage
Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources

## style
We decided as a group to align our style of writing code. We decided ES6 styling for the body. We also decided to unify our commenting styling. For major sections, we will have styling in the form

//----------------- Section header -----------------//

For commenting on specific subsections, commenting will be done above the section and not to the side. E.g

 //if the set time is before the rise time, get the next set time
    if(rise.date > set.date) {
        date = rise.date;
        set = Astronomy.SearchRiseSet(planet, observer, -1, date ,1);
    }

## Credits

* Gan Hong

* Angelika Amor 

* Matthew Durflinger 

* Jackson Morris-Thring