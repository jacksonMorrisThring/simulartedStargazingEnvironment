var requestURL = "https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536,104.9847034&key=AIzaSyC9_Hwila4HqG-J434rRupUsJho4lAsYtE";

fetch(requestURL)
    .then (function(response){
        console.log(response.status);
        return response.json();
    })

    .then( function(data){
        console.log("returned data is: " + data);
    })