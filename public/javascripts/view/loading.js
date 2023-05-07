async function initPage() {
    navigator.geolocation.getCurrentPosition(async position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        let location = {
            lat: latitude,
            lng: longitude
        }
        window.location.href = `/index?lat=${location.lat}&lng=${location.lng}`
    });
}

