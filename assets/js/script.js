var infoEl = $('#info');


requestURL = 'https://api.le-systeme-solaire.net/rest/bodies';

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
