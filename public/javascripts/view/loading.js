async function initPage() {
    // Save LocationInfo
    await saveLocation()
    // let data  = await isDataExist(location_store)
    // let location = {
    //     lat: data.lat,
    //     lng: data.lng
    // }
}

async function saveLocation() {
    await navigator.geolocation.getCurrentPosition(async position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        let location = {
            lat: latitude,
            lng: longitude
        }
        window.location.href = `/index?lat=${location.lat}&lng=${location.lng}`
    });
}

