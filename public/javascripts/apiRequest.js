// Template code
// async function getSightList() {
//     try {
//         const response = await fetch('/getSightList', { method: 'GET' });
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error(error);
//     }
// }

async function addSight() {
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    const identification = document.getElementById('identification').value;
    const image = document.getElementById('image').files[0];
    const loc = {"lat": sessionStorage.getItem("lat"), "lng": sessionStorage.getItem("lng")}
    const userExist = await isDataExist(user_store)
    // const userExist = await isUserExist();
    const username = userExist.username;

    const sightData = new FormData();
    sightData.append('date', date);
    sightData.append('description', description);
    sightData.append('identification', identification);
    sightData.append('image', image);
    sightData.append('user_name', username);
    sightData.append('loc', JSON.stringify(loc));

    fetch('/saveSighting', {
        method: 'POST',
        body: sightData
    }).then(data => {
        //TODO Maybe we can update the page by JS
        // Which means we need to have `store<Date/Distance>` functions locally
        console.log(data);
        alert("Add Success!")
        closeModal();
        window.location.reload();
    }).catch(error => {
        //Register sync
        registerSyncBird();

        // If saving to server fails, save data to IndexedDB
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = function(event){
            const sightDataLocal = {
                date,
                description,
                identification,
                image:event.target.result,
                user_name: username,
                loc: loc,
            };
            insertToStore('bird', sightDataLocal);
            console.error('Failed to save data to server:', error);
            console.log('Data saved to IndexedDB:', sightDataLocal);
            alert('Failed to save data to server. Data saved locally.');
            closeModal();
            // window.location.reload();
        }
    });
}

async function sortByDate() {
    const response = await fetch('/sortByDate', {method: 'GET'})
    const stringPromise = response.text();
    document.write(await stringPromise);
}

/**
 * TODO The process is too slow
 * @returns {Promise<void>}
 */
async function sortByDistance() {
    let location = await isDataExist(location_store)
    let latitude = location.lat
    let longitude = location.lng
    let url = `/sortByDistance?lat=${latitude}&lng=${longitude}`
    const response = await fetch(url, {method: 'GET'})
    const stringPromise = await response.text();
    document.write(stringPromise);
}

async function getDetails(event) {
    let id = event.currentTarget.id
    const response = await fetch('/sightDetails/' + id, {method: 'GET'})
    const stringPromise = response.text();

    document.write(await stringPromise);
}


function registerSyncBird() {
    new Promise(function (resolve, reject) {
        Notification.requestPermission(function (result) {
            resolve();
        })
    }).then(function () {
        return navigator.serviceWorker.ready;
    }).then(function (reg) {
        //here register your sync with a tagname and return it
        return reg.sync.register('sync-data');
    }).then(function () {
        console.info('Sync registered');
    }).catch(function (err) {
        console.error('Failed to register sync', err.message);
    });
}
