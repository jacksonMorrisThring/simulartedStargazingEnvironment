
//Hard coded latt and long variables. Note: sig figs are flexible, can many or few
//decimal points
var lattVar = 39;
var longVar = -104;

//Request URL with location query paramter and api key paramter
var fnRequestURL = "https://maps.googleapis.com/maps/api/elevation/json?locations="+lattVar+"%2C"+longVar+"&key=AIzaSyBzLHUoT5HXQ28s19821jaSJxj1QBHXhpc";


fetch(fnRequestURL)
    .then (function(response){
        // console.log(response.status);
        return response.json();
    })

    .then( function(data){
        //Debugging showing path
        // console.log("returned data.results[0] is: ");
        // console.log(data.results[0]);

        //assigning an object variable to the google data object containing elevation
        var objectData = data.results[0]
        console.log("returned data converted from object is: " + objectData.elevation);
    })