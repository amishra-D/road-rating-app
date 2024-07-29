var map = L.map('map').setView([20.5937, 78.9629], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

map.locate({ setView: true, maxZoom: 16 });

var userLocationMarker;
var userLatLng;
var searchedLatLng;

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

  document.getElementById('source').value = `Lat: ${userLatLng.lat.toFixed(4)}, Lng: ${userLatLng.lng.toFixed(4)}`;
}

function onLocationError(e) {
  alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

var geocoder = L.Control.geocoder({
  defaultMarkGeocode: false
})
.on('markgeocode', function(e) {
  var latlng = e.geocode.center;
  L.marker(latlng).addTo(map)
    .bindPopup(e.geocode.name).openPopup();
  map.setView(latlng, 16); 

  searchedLatLng = latlng;

  document.getElementById('DestinationBox').value = e.geocode.name;
})
.addTo(map);

function createBikeIcon(zoom) {
  var size = Math.max(32, zoom * 4); 
  return L.icon({
    iconUrl: 'path/to/bike-icon.png',
    iconSize: [size, size], 
    iconAnchor: [size / 2, size], 
    popupAnchor: [0, -size] 
  });
}

document.getElementById('travel-btn').addEventListener('click', function() {
  if (userLatLng && searchedLatLng) {
    var bikeIcon = createBikeIcon(map.getZoom());

    if (userLocationMarker) {
      map.removeLayer(userLocationMarker);
    }

    L.marker(userLatLng, { icon: bikeIcon })
      .bindPopup("<div><h3>Bike Location</h3><p>Your current location has been updated to a bike marker.</p></div>")
      .addTo(map);

    L.Routing.control({
      waypoints: [
        L.latLng(userLatLng.lat, userLatLng.lng),
        L.latLng(searchedLatLng.lat, searchedLatLng.lng)
      ],
      routeWhileDragging: true
    }).addTo(map);

    document.getElementById('review-fields').style.display = 'block';
  } else {
    alert('Please search for a location and ensure your current location is detected.');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const profileName = document.getElementById('profile-name');
  const loginBtn = document.getElementById('login-btn');
  const userEmail = localStorage.getItem('userEmail');

  if (userEmail) {
    profileName.textContent = userEmail;
    loginBtn.style.display = 'none';
  }
});

let travelClicked = false;

document.getElementById('travel-btn').addEventListener('click', () => {
  travelClicked = true;
});

document.getElementById('review-section').addEventListener('click', () => {
  if (travelClicked) {
    document.getElementById('review-fields').style.display = 'block';
  }
});
