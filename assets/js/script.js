var infoEl = $('#info');

//raw data for jan 20th 2022 adelaide
var data = [
    ['Mercury', "07:07", "20:40"],
    ['Venus', "05:22", "18:59"],
    ['Mars', "03:49", "18:18"],
    ['Jupiter', "09:11", "22:16"],
    ['Saturn', "07:32", "21:17"],
    ['Uranus', "14:30", "23:59"],
    ['Saturn', "10:31", "23:00"]
];

var requestURL = 'https://api.le-systeme-solaire.net/rest/bodies';

//Index 0: planet name. index 1: rise time. index 2: set time
//date: 20th of January 2022
var data2 = [
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
        //console.log(data);
        //console.log(data.bodies.length);
        for (let i = 0; i < data.bodies.length; i++) {
            if (data.bodies[i].isPlanet === true) {
                //console.log(data.bodies[i]);
            }
        }
    })
    

function handleTime() {
    //This loop goes through the data array, and assigns the rise and
    //fall time strings on each loop to the below variables
    for (let i = 0; i < 7; i++) {
        var Frise_time = data[i][1];
        var Ffall_time = data[i][2];
        console.log("Frise_time takes value: " + Frise_time);
        console.log("Ffall_time takes value: " + Ffall_time);

        //arrays that each digit will be copied into individually
        var num_array1 = [];
        var num_array2 = [];

        //counters used to not count on the semi-colon index of the strings
        var counter1 = 0;
        var counter2 = 0;

        //for loop removes : and puts each number as its own index in an
        //array
        for (var j = 0; j < 5; ++j) {
            if (Frise_time.at(j) != ':') {
                num_array1[counter1] = Frise_time.at(j);
                counter1++;
            }
            if (Ffall_time.at(j) != ':') {
                num_array2[counter2] = Ffall_time.at(j);
                counter2++;
            }
        }

        //logs the arrays in console
        console.log("num_array1 takes value: " + num_array1);
        console.log("num_array2 takes value: " + num_array2);

        var resultrt = 0;
        var resultft = 0;


        //Conversion from array of integers, to single integers 
        //that quantitatively represent the time. Below if statement 
        //handles case where fall time is next day, as that will stuff
        //up the interval
        for (var k = 0; k < 4; ++k) {
            resultrt = resultrt + (num_array1[k]) * (1000 / ((10 ** k)));
            resultft = resultft + (num_array2[k]) * (1000 / ((10 ** k)));
        }

        console.log("rise time is " + resultrt);
        console.log("fall time is " + resultft);

        //This part is for later once we have user input
        // if (resultft<resultrt)
        // {
        // 	resultft = resultft + 2400;
        // }

    }
}

handleTime();
