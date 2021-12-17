const key = config.IPIFY_API_KEY;
const token = config.MAP_ACCESS_TOKEN;

let ipText = document.querySelector('#ip');

let locationText = document.querySelector('#location');

let timezoneText = document.querySelector('#timezone');

let ispText = document.querySelector('#isp');

const submitBtn = document.querySelector('.submit-btn')

const ipInput = document.querySelector('.ip-input')

const errorText = document.querySelector('.error')

let inputText = ipInput.value;

ipInput.addEventListener('input', validateInput());

submitBtn.addEventListener('click', () => {
    inputText = ipInput.value;
    if (validateInput()) {
        errorText.classList.remove('show');
        getData();
    } else {
        errorText.classList.add('show');
    }
});

updateMarker = (update_marker = [-33.665, 18.993]) => {
    map.setView(update_marker, 13);
    L.marker(update_marker).addTo(map);
}

function validateInput(inputText) {
    const ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipInput.value.match(ipformat);
}

// MAP API

var map = L.map('map', { zoomControl: false }).setView([37.38605, -122.08385], 13);

var blackMarker = L.icon({
    iconUrl: '/images/icon-location.svg',
    iconSize: [46, 56], // size of the icon
    iconAnchor: [23, 56], // point of the icon which will correspond to marker's location
});

var marker = L.marker([37.38605, -122.08385], { icon: blackMarker }).addTo(map);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: token
}).addTo(map);



function getData() {
    axios.get(`https://geo.ipify.org/api/v2/country,city?apiKey=${key}&ipAddress=${inputText}`).then(({ data }) => {
        // console.log(data);
        ipText.innerText = data.ip;
        ispText.innerText = data.isp;
        locationText.innerText = `${data.location.city}, ${data.location.country} ${data.location.postalCode}`;
        timezoneText.innerText = `UTC ${data.location.timezone}`;
        updateMarker([data.location.lat, data.location.lng]);
    }).catch(error => {
        alert("Unable to get IP details")
        console.log(error)
    })
};
