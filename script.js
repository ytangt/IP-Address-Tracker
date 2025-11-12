import { API_KEY } from "./secret.js";

const ipForm = document.getElementById("ip-form");
const inputField = document.getElementById("ip-address");

const displayIP = document.getElementById("ip");
const displayLocation = document.getElementById("city");
const displayZip = document.getElementById("zip-code");
const displayTimezone = document.getElementById("timezone");
const displayISP = document.getElementById("isp");
const displayError = document.getElementById("error-message");

// initialize map
let leafletMap = L.map("map").setView([0, 0], 2);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(leafletMap);
//initialize marker
let marker = L.marker([0, 0], {
  icon: L.icon({
    iconUrl: "images/icon-location.svg",
    iconSize: [40, 50],
  }),
}).addTo(leafletMap);

// update the map to a new location
function updateMap(lat, lng) {
  //zoom in to city level
  leafletMap.setView([lat, lng], 13); 
  //move market ot th new coordinate
  marker.setLatLng([lat, lng]);
}

// update IP 
function updateResults(data) {
  displayIP.textContent = data.ip;
  displayLocation.textContent = `${data.location.city}, ${data.location.region}`;
  displayZip.textContent = data.location.postalCode;
  displayTimezone.textContent = `UTC ${data.location.timezone}`;
  displayISP.textContent = data.isp;
}

// Fetch Ip from GeoIPify API
async function fetchIPData(query = "") {
  try {
    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}${query}`;
    console.log("Fetching URL:", url);

    const res = await fetch(url);
    if (!res.ok) {
      displayError.classList.remove("d-none");
      throw new Error(`Fetching error: ${res.status}`);
    }

    const data = await res.json();
    console.log("API response:", data);

    //update page with API
    updateResults(data);
    updateMap(data.location.lat, data.location.lng);
  } catch (err) {
    console.error(err);
    displayError.classList.remove("d-none");
  }
}

// Handle form submission
ipForm.addEventListener("submit", (e) => {
  e.preventDefault();
  displayError.classList.add("d-none");

  const value = inputField.value.trim();
  let queryParam = "";

  if (value) {
    //pass value to API
    queryParam = `&ipAddress=${value}`;
  }

  fetchIPData(queryParam);
});

// fetch user's IP by default
fetchIPData();