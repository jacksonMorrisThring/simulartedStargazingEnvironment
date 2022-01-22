var infoEl = $('#info');

//raw data for jan 20th 2022 adelaide
var data = [
    ['Mercury', "07:07", "20:40"],
    ['Venus', "05:22", "18:59"],
    ['Mars', "03:49", "18:18"],
    ['Jupiter', "09:11", "22:16"],
    ['Saturn', "07:32", "21:17"],
    ['Uranus', "14:30", "23:59"],
    ['Neptune', "10:31", "23:00"]
];


var data31 = [
    ['Mercury', "05:27", "12:21"],
    ['Venus', "04:29", "11:19"],
    ['Mars', "03:37", "10:52"],
    ['Jupiter', "08:37", "15:08"],
    ['Saturn', "06:52", "13:45"],
    ['Uranus', "13:45", "19:06"],
    ['Neptune', "09:47", "16:02"]
];


var data1 = [
    ['Mercury', "05:20", "12:15"],
    ['Venus', "04:25", "11:15"],
    ['Mars', "03:36", "10:51"],
    ['Jupiter', "08:34", "15:05"],
    ['Saturn', "06:49", "13:41"],
    ['Uranus', "13:41", "19:02"],
    ['Neptune', "09:43", "15:59"]
];


var data2 = [
    ['Mercury', "05:14", "12:10"],
    ['Venus', "04:22", "11:12"],
    ['Mars', "03:36", "10:51"],
    ['Jupiter', "08:32", "15:02"],
    ['Saturn', "06:45", "13:38"],
    ['Uranus', "13:37", "18:58"],
    ['Neptune', "09:39", "15:55"]
];


var data3 = [
    ['Mercury', "05:08", "12:05"],
    ['Venus', "04:18", "11:08"],
    ['Mars', "03:35", "10:50"],
    ['Jupiter', "08:29", "14:59"],
    ['Saturn', "06:42", "13:34"],
    ['Uranus', "13:33", "18:54"],
    ['Neptune', "09:35", "15:51"]
];


var data4 = [
    ['Mercury', "05:03", "12:00"],
    ['Venus', "04:15", "11:05"],
    ['Mars', "03:34", "10:49"],
    ['Jupiter', "08:26", "14:56"],
    ['Saturn', "06:39", "13:31"],
    ['Uranus', "13:30", "18:50"],
    ['Neptune', "09:32", "15:47"]
];


var data5 = [
    ['Mercury', "04:58", "11:56"],
    ['Venus', "04:12", "11:02"],
    ['Mars', "03:34", "10:48"],
    ['Jupiter', "08:23", "14:53"],
    ['Saturn', "06:35", "13:27"],
    ['Uranus', "13:26", "18:47"],
    ['Neptune', "09:28", "15:43"]
];


var data6 = [
    ['Mercury', "04:55", "11:53"],
    ['Venus', "04:09", "10:59"],
    ['Mars', "03:33", "10:48"],
    ['Jupiter', "08:20", "14:50"],
    ['Saturn', "06:32", "13:24"],
    ['Uranus', "13:22", "18:43"],
    ['Neptune', "09:24", "15:39"]
];

var requestURL = 'https://api.le-systeme-solaire.net/rest/bodies';


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
        //var Fcurrent_time = ... brought in from HTML


        console.log("Frise_time takes value: " + Frise_time);
        console.log("Ffall_time takes value: " + Ffall_time);

        //arrays that each digit will be copied into individually
        var num_array1 = [];
        var num_array2 = [];
        //var num_array3 = [];

        //counters used to not count on the semi-colon index of the strings
        var counter1 = 0;
        var counter2 = 0;
        //var counter3 = 0;

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
            // if (Fcurrent_time.at(j) != ':') {
            //     num_array3[counter3] = Fcurrent_time.at(j);
            //     counter3++;
            // }
        }

        //logs the arrays in console
        console.log("num_array1 takes value: " + num_array1);
        console.log("num_array2 takes value: " + num_array2);

        var resultrt = 0;
        var resultft = 0;
        //var resultct = 0;


        //Conversion from array of integers, to single integers 
        //that quantitatively represent the time. Below if statement 
        //handles case where fall time is next day, as that will stuff
        //up the interval
        for (var k = 0; k < 4; ++k) {
            resultrt = resultrt + (num_array1[k]) * (1000 / ((10 ** k)));
            resultft = resultft + (num_array2[k]) * (1000 / ((10 ** k)));
            //resultct = resultct + (num_array3[k]) * (1000 / ((10 ** k)));
        }

        console.log("rise time is " + resultrt);
        console.log("fall time is " + resultft);
        //console.log("current time is " + resultct);

        //This part is for later once we have user input
        // if (resultft<resultrt)
        // {
        // 	resultft = resultft + 2400;
        // }

    }
}

handleTime();
