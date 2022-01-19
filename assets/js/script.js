var infoEl = $('#info');


var requestURL = 'https://api.le-systeme-solaire.net/rest/bodies';

//Index 0: planet name. index 1: rise time. index 2: set time
//date: 20th of January 2022
var data = [
    ['Mercury', 707, 2040],
    ['Venus', 522, 1859],
    ['Mars', 349, 1818],
    ['Jupiter', 911, 2216],
    ['Saturn', 732, 2117],
    ['Uranus', 1430, 2359],
    ['Saturn', 1031, 2300]
];

fetch(requestURL)
    .then (function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        console.log(data.bodies.length);
        for (let i = 0; i < data.bodies.length; i++) {
            if (data.bodies[i].isPlanet === true) {
                console.log(data.bodies[i]);
            }
        }
    })

    console.log("Planet name: " + data[0][0] + "   rise time: " + data[0][1]
    + "   set time: " + data[0][2]);

