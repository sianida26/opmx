import L from "leaflet";

//Array for storing circles
const circles: L.Circle[] = [];

const syncToStorage = () => {
	localStorage.setItem(
		"s1t1/coordinates",
		JSON.stringify(
			circles.map((x) => [x.getLatLng().lat, x.getLatLng().lng])
		)
	);
	localStorage.setItem("s1t1/lastedit", String(new Date().getTime()));
    sendDataToParentWindow()
};

const sendDataToParentWindow = () => {
    window.parent.postMessage({
        taskId: "s1t1",
        action: "updateCoordinate",
        value: circles.map((x) => [x.getLatLng().lat, x.getLatLng().lng])
    }, "*")
}

//Initialize map
const map = L.map("map", {
	center: [-4.640356627869356, 122.98972427165803],
	zoom: 5,
});

const circleOption = {
	color: "green",
	fillColor: "green",
	fillOpacity: 0.5,
	radius: 100000,
};

//Add tile layers from OSM into leaflet
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
	maxZoom: 19,
	attribution:
		'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

//Populate coordinates
if (localStorage.getItem("s1t1/coordinates")) {
	const coordinates = JSON.parse(
		localStorage.getItem("s1t1/coordinates") || "[]"
	) as number[][];
	coordinates.forEach((coordinate) =>
		circles.push(
			L.circle([coordinate[0], coordinate[1]], circleOption).addTo(map)
		)
	);
}

//Send initial data to parent window
sendDataToParentWindow()

map.on("click", (e) => {
	for (let i = 0; i < circles.length; i++) {
		//If the clicked point contains circle, remove the circle
		if (circles[i].getBounds().contains(e.latlng)) {
			map.removeLayer(circles[i]);
			circles.splice(i, 1);
			syncToStorage();
			return;
		}
	}

	// If none of the circles contain the clicked point, create a new circle
	const circle = L.circle([e.latlng.lat, e.latlng.lng], circleOption).addTo(
		map
	);

	// Add the new circle to the circles array
	circles.push(circle);
	syncToStorage();
});
