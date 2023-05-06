async function initPage() {
    let user = await isDataExist(user_store)
    // saveLocation()
    if (user) {
        let username = user.username
        setUsername(username)
    } else {
        // TODO Make the page unselectable when a dialog is popped up and set other content to gray
        showUserSetting()
    }
}

// function saveLocation() {
//     navigator.geolocation.getCurrentPosition(async position => {
//         const latitude = position.coords.latitude;
//         const longitude = position.coords.longitude;
//         let location = {
//             lat: latitude,
//             lng: longitude
//         }
//         updateSingleton(location, location_store, function (data, newData) {
//             data.lat = newData.lat
//             data.lng = newData.lat
//         }).then(() => {
//             console.log("Save Success!")
//         })
//         sessionStorage.setItem("lat",latitude)
//         sessionStorage.setItem("lng",longitude)
//     });
// }

function showCreate() {
    var modal = document.getElementById("addSight");
    modal.style.display = "block";
}

function closeModal() {
    var modal = document.getElementById("addSight");
    modal.style.display = "none";
}

document.getElementById("by-location-btn").addEventListener('click', function () {
    sortByDistance()
})