// Initialize the map centered on India
var map = L.map('map').setView([20.5937, 78.9629], 4);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

// Add geolocation tracking
map.locate({ setView: true, maxZoom: 16 });

var userLocationMarker;
var userLatLng;
var searchedLatLng;

// Function to handle location found
function onLocationFound(e) {
  var radius = e.accuracy / 2;

  if (userLocationMarker) {
    map.removeLayer(userLocationMarker);
  }

  userLocationMarker = L.marker(e.latlng).addTo(map)
    .bindPopup("<div><h3>Your Location</h3><p>You are within " + radius + " meters from this point.</p></div>")
    .openPopup();

  L.circle(e.latlng, radius).addTo(map);

  userLatLng = e.latlng;

  // Autofill the source field
  document.getElementById('source').value = `Lat: ${userLatLng.lat.toFixed(4)}, Lng: ${userLatLng.lng.toFixed(4)}`;
}

// Function to handle location error
function onLocationError(e) {
  alert(e.message);
}

// Add event listeners for location found and error
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// Add geocoder control for searching
var geocoder = L.Control.geocoder({
  defaultMarkGeocode: false
})
.on('markgeocode', function(e) {
  var latlng = e.geocode.center;
  L.marker(latlng).addTo(map)
    .bindPopup(e.geocode.name).openPopup();
  map.setView(latlng, 16); // Adjust zoom level as needed

  searchedLatLng = latlng;

  // Autofill the destination field
  document.getElementById('DestinationBox').value = e.geocode.name;
})
.addTo(map);

// Function to create the bike icon with dynamic size based on zoom level
function createBikeIcon(zoom) {
  var size = Math.max(32, zoom * 4); // Increase size
  return L.icon({
    iconUrl: 'path/to/bike-icon.png', // URL of the bike icon image
    iconSize: [size, size], // Adjust size as needed
    iconAnchor: [size / 2, size], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -size] // Point from which the popup should open relative to the iconAnchor
  });
}

// Add event listener to the Travel button
document.getElementById('travel-btn').addEventListener('click', function() {
  if (userLatLng && searchedLatLng) {
    // Change the marker icon to a bike
    var bikeIcon = createBikeIcon(map.getZoom());

    // Remove the existing current location marker
    if (userLocationMarker) {
      map.removeLayer(userLocationMarker);
    }

    // Add a new marker with the bike icon
    L.marker(userLatLng, { icon: bikeIcon })
      .bindPopup("<div><h3>Bike Location</h3><p>Your current location has been updated to a bike marker.</p></div>")
      .addTo(map);

    // Route calculation
    L.Routing.control({
      waypoints: [
        L.latLng(userLatLng.lat, userLatLng.lng),
        L.latLng(searchedLatLng.lat, searchedLatLng.lng)
      ],
      routeWhileDragging: true
    }).addTo(map);

    // Show the additional fields
    document.getElementById('review-fields').style.display = 'block';
  } else {
    alert('Please search for a location and ensure your current location is detected.');
  }
});

// Handle profile name display
document.addEventListener('DOMContentLoaded', () => {
  const profileName = document.getElementById('profile-name');
  const userEmail = localStorage.getItem('userEmail');
  if (userEmail) {
    profileName.textContent = userEmail;
  }
});

// Handle travel button click
let travelClicked = false;

document.getElementById('travel-btn').addEventListener('click', () => {
  travelClicked = true;
});

// Handle review section display
document.getElementById('review-section').addEventListener('click', () => {
  if (travelClicked) {
    document.getElementById('review-fields').style.display = 'block';
  }
});
