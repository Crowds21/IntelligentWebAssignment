async function initPage() {
    // Save LocationInfo
    await saveLocation()
    let data  = await isDataExist(location_store)
    let location = {
        lat: data.lat,
        lng: data.lng
    }
    // location = JSON.parse(location)
    // Get recordList
    // fetch('/verifyInfo', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(location)
    // }).then(res=>{
    //     console.log("verifyInfoSuccess")
    //
    // }).catch( err =>{
    //     console.log("verifyInfoError")
    //    // window.location.href('/index')
    // })
    window.location.href = `/index?lat=${location.lat}&lng=${location.lng}`
}

async function saveLocation() {
    await navigator.geolocation.getCurrentPosition(async position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        let location = {
            lat: latitude,
            lng: longitude
        }
        await updateSingleton(location, location_store, function (data, newData) {
            data.lat = newData.lat
            data.lng = newData.lng
        })
    });
}

