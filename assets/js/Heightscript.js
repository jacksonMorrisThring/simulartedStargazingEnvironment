
var requestURL = "https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536%2C-104.9847034&key=AIzaSyBzLHUoT5HXQ28s19821jaSJxj1QBHXhpc";

fetch(requestURL)
    .then (function(response){
        console.log(response.status);
        return response.json();
    })

    .then( function(data){
        console.log("returned data is: ");
        console.log(data);
        console.log("returned data.results is: ");
        console.log(data.results);
        console.log("returned data.results[0] is: ");
        console.log(data.results[0]);


        var objectData = data.results[0]
        console.log("returned data converted from object is: " + objectData.elevation);
    })

    


    // const elevator = new google.maps.ElevationService();

    // elevator
    // .getElevationForLocations({
    //   locations: [39.7391536,104.9847034],
    // })
    // .then(({ results }) => {