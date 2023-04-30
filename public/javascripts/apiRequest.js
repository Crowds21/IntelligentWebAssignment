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
    const loc = {"lat":sessionStorage.getItem("lat"), "lng":sessionStorage.getItem("lng")}
    const userExist = await isUserExist();
    const username = userExist.username;

    const sightData = new FormData();
    sightData.append('date', date);
    sightData.append('description', description);
    sightData.append('identification', identification);
    sightData.append('image', image);
    sightData.append('user_name', username);
    sightData.append('loc', JSON.stringify(loc));

    await fetch('/saveSighting', {
        method: 'POST',
        body: sightData
    })
        .then(data => {
            console.log(data);
            alert("Add Success!")
            closeModal();
            window.location.reload();
        })
        .catch(error => {
            console.error(error);
            alert(" Add Failure!");
        });
}

async function sortByDate() {
    const response = await fetch('/sortByDate', {method: 'GET'})
    const stringPromise = response.text();
    document.write(await stringPromise);

}

async function getDetails(event) {
    let id = event.currentTarget.id
    const response = await fetch('/sightDetails/' + id, {method: 'GET'})
    const stringPromise = response.text();
    document.write(await stringPromise);
}


// let elements = document.getElementsByClassName("home-page-sight-card")
// for (let i = 0; i < elements.length; i++) {
//     console.log(i)
//     elements[i].addEventListener("click", function (event) {
//         // 在这里添加事件处理逻辑
//         getDetails(event).then(r => {
//             console.log("Details Page")
//         })
//     });
// }

window.addEventListener('online', async () => {
    console.log('Network reconnected');

    // 获取当前 Service Worker 注册
    const registration = await navigator.serviceWorker.getRegistration();

    if (registration) {
        // 强制更新 Service Worker
        registration.update().then(() => {
            console.log('Service Worker updated');
        });
    }
});