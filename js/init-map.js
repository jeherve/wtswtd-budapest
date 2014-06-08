// Init Map
var map = L.mapbox.map('map')
    .setView([47.50089, 19.06324], 15)
    .addLayer(L.mapbox.tileLayer('examples.map-h67hf2ic'));

// Get data from github
var url = 'https://api.github.com/repos/jeherve/wtswtd-budapest/contents/bp-doh.geojson?ref=master';

function load() {
	// Fetch just the contents of a .geojson file from GitHub by passing
	// `application/vnd.github.v3.raw` to the Accept header
	// As with any other AJAX request, this technique is subject to the Same Origin Policy:
	// http://en.wikipedia.org/wiki/Same_origin_policy the server delivering the request should support CORS.
	$.ajax({
		headers: {
			'Accept': 'application/vnd.github.v3.raw'
		},
		dataType: 'json',
		url: url,
		success: function(geojson) {
			// On success add fetched data to the map.
			var markerLayer = L.mapbox.markerLayer(geojson);

			// Generate the pop ups
			markerLayer.eachLayer(function(layer) {

				// here you call `bindPopup` with a string of HTML you create - the feature
				// properties declared above are available under `layer.feature.properties`
				var content = '<h1>' + layer.feature.properties.name + '<\/h1>';
				if (typeof layer.feature.properties.URL != 'undefined') {
					content = '<h1><a target="_blank" href="' + layer.feature.properties.URL + '">' + layer.feature.properties.name + '<\/a><\/h1>';
				}
				if (typeof layer.feature.properties.address != 'undefined') {
					content += '<h2>' + layer.feature.properties.address + '<\/h2>';
				}
				if (typeof layer.feature.properties.note != 'undefined') {
					content += '<p class="note">' + layer.feature.properties.note + '<\/p>';
				}
				if (typeof layer.feature.properties.phone != 'undefined') {
					content += '<p class="phone">'+ layer.feature.properties.phone + '<\/p>';
				}

				layer.bindPopup(content);
			});

			var clusterGroup = new L.MarkerClusterGroup();
			markerLayer.eachLayer(function(layer) {
				clusterGroup.addLayer(layer);
			});
			map.addLayer(clusterGroup);
		}
	});
}
$(load);

// Init geolocation
var geolocate = document.getElementById('geolocate');
// This uses the HTML5 geolocation API, which is available on
// most mobile browsers and modern browsers, but not in Internet Explorer
//
// See this chart of compatibility for details:
// http://caniuse.com/#feat=geolocation
if (!navigator.geolocation) {
	geolocate.innerHTML = 'geolocation is not available';
} else {
	geolocate.onclick = function (e) {
		e.preventDefault();
		e.stopPropagation();
		map.locate();
	};
}

// Once we've got a position, zoom and center the map
// on it, and add a single marker.
map.on('locationfound', function(e) {
	map.fitBounds(e.bounds);

	map.markerLayer.setGeoJSON({
		type: "Feature",
		geometry: {
			type: "Point",
			coordinates: [e.latlng.lng, e.latlng.lat]
		},
		properties: {
			'marker-color': '#000',
			'marker-symbol': 'star-stroked'
		}
	});

	// And hide the geolocation button
	geolocate.parentNode.removeChild(geolocate);
});

// If the user chooses not to allow their location
// to be shared, display an error message.
map.on('locationerror', function() {
	geolocate.innerHTML = 'position could not be found';
});
