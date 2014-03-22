// Init Map
var map = L.mapbox.map('map', 'examples.map-h67hf2ic')
  .setView([47.50089, 19.06324], 15);

// Get data from github
var url = 'https://api.github.com/repos/jeherve/wtswtd-budapest/contents/bp-doh.geojson?ref=bp-doh';

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
			//L.mapbox.featureLayer(geojson).addTo(map);
			var markerLayer = L.mapbox.markerLayer(geojson).addTo(map);

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

			// Generate the filters
			// find and store a variable reference to the list of filters
			var filters = document.getElementById('filters');

			// collect the types of symbols in this layer. you can also just
			// hardcode an array of types if you know what you want to filter on,
			// like
			// var types = ['foo', 'bar'];
			var typesObj = {}, types = [];
			var features = markerLayer.getGeoJSON().features;
			for (var i = 0; i < features.length; i++) {
				typesObj[features[i].properties['marker-symbol']] = true;
			}
			for (var k in typesObj) types.push(k);

			var checkboxes = [];
			// create a filter interface
			for (var i = 0; i < types.length; i++) {
				// create an <li> list element for each type, and add an input checkbox
				// and label inside
				var li = filters.appendChild(document.createElement('li'));
				var checkbox = li.appendChild(document.createElement('input'));
				var label = li.appendChild(document.createElement('label'));
				checkbox.type = 'checkbox';
				checkbox.id = types[i];
				checkbox.checked = true;
				// create a label to the right of the checkbox with explanatory text
				label.innerHTML = types[i];
				label.setAttribute('for', types[i]);
				// whenever a person clicks on this checkbox, call the update() function
				// below
				checkbox.addEventListener('change', update);
				checkboxes.push(checkbox);
			}

			// this function is called whenever someone clicks on a checkbox and changes
			// the selection of markers to be displayed
			function update() {
				var enabled = {};
				// run through each checkbox and record whether it is checked. If it is,
				// add it to the object of types to display, otherwise do not.
				for (var i = 0; i < checkboxes.length; i++) {
					if (checkboxes[i].checked) enabled[checkboxes[i].id] = true;
				}
				markerLayer.setFilter(function(feature) {
					// if this symbol is in the list, return true. if not, return false.
					// the 'in' operator in javascript does exactly that: given a string
					// or number, it says if that is in a object
					// 2 in { 2: true } // true
					// 2 in { } // false
					return (feature.properties['marker-symbol'] in enabled);
				});
			}
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
