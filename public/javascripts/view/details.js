async function initPage() {
    let lat = document.getElementById("iframe-record-map").getAttribute("data-record-lat")
    let lng = document.getElementById("iframe-record-map").getAttribute("data-record-lng")
    let user = await isDataExist(user_store)
    let username = user.username
    setUsername(username)
    document.getElementById("iframe-record-map").src = createMapIframeSrc(lat, lng)
}

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 53.38101, lng: -1.46831},
        zoom: 15,
    });
    const marker = new google.maps.Marker({
        map: map,
        position: {lat: 53.38101, lng: -1.46831},
        draggable: true,
    });
    google.maps.event.addListener(marker, "dragend", (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
    });
}


/**
 * Create the src attribute of the map iframe
 * @param latitude
 * @param longitude
 * @returns {string}
 */
function createMapIframeSrc(latitude, longitude) {
    const MAP_API_KEY = "AIzaSyAM-bshugA-Y5IFRz4k18zWvxsntiU4sqs"
    return `https://www.google.com/maps/embed/v1/place?key=${MAP_API_KEY}&q=${latitude},${longitude}`
}
