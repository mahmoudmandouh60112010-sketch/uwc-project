const map = L.map('map').setView([0, 0], 2);
marker.setLatLng([latitude, longitude]);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const issIcon = L.icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});
const marker = L.marker([0, 0], { icon: issIcon }).addTo(map);

let pathCoords = [];
let pathLine = L.polyline([], { color: 'red' }).addTo(map);

async function getISS() {
  try {
    const response = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
    const data = await response.json();
    const { latitude, longitude, altitude, velocity } = data;

    // Update marker only (no auto-centering)
    marker.setLatLng([latitude, longitude]);

    // Add to path
    pathCoords.push([latitude, longitude]);
    pathLine.setLatLngs(pathCoords);

    // Update info panel
    document.getElementById("info").innerText =
      `Latitude: ${latitude.toFixed(2)} | Longitude: ${longitude.toFixed(2)} 
       Altitude: ${altitude.toFixed(2)} km | Velocity: ${velocity.toFixed(2)} km/h`;
  } catch (error) {
    document.getElementById("info").innerText = "Error fetching ISS data.";
    console.error("Error fetching ISS data:", error);
  }
}

getISS();
setInterval(getISS, 10000);
