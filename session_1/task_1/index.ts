import L from 'leaflet'

//Initialize map
const map = L.map('map', {
    center: [-4.640356627869356, 122.98972427165803],
    zoom: 5
});

//Add tile layers from OSM into leaflet
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//Array for storing circles
const circles: L.Circle[] = [];

map.on('click', (e) => {

    for (let i = 0; i < circles.length; i++){

        //If the clicked point contains circle, remove the circle
        if (circles[i].getBounds().contains(e.latlng)){
            map.removeLayer(circles[i])
            circles.splice(i, 1)
            return
        }
    }

    // If none of the circles contain the clicked point, create a new circle
    const circle = L.circle([e.latlng.lat, e.latlng.lng], {
        color: 'green',
        fillColor: 'green',
        fillOpacity: 0.5,
        radius: 100000
    }).addTo(map);

    // Add the new circle to the circles array
    circles.push(circle);
})
