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
