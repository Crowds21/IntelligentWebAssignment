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
        console.log(data);
        alert("Add Success!")
        closeModal();
        window.location.reload();
    }).catch(error => {
        // If saving to server fails, save data to IndexedDB
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = function (event) {
            const sightDataLocal = {
                date,
                description,
                identification,
                image: event.target.result,
                user_name: username,
                loc: loc,
            };
            insertRecordToStore('bird', sightDataLocal);
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


async function saveChatContent(user, sight_id, content) {
    let data = {
        user: user,
        sight_id: sight_id,
        content: content
    }
    fetch('/saveChatContent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(() => {
        // writeOnHistory(data.user,data.content)
        console.log("SaveNewChat")
    }).catch(async (error) => {
        await insertChatToStore(chat_store, data)
        console.log("ChatInfo InsertIntoIndexedDB")
        registerTag("saveChat")
    })
}

function registerTag(tagName){
    new Promise(function (resolve, reject) {
        Notification.requestPermission(function (result) {
            resolve();
        })
    }).then(function () {
        return navigator.serviceWorker.ready;
    }).then(function (reg){
        return reg.sync.register(tagName)
        //here register your sync with a tagname and return it
    }).then(function () {
        console.info('Sync registered');
    })
}
