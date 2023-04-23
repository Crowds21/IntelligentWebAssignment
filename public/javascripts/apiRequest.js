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
    const location = document.getElementById('location').value;
    const description = document.getElementById('description').value;
    const identification = document.getElementById('identification').value;
    const image = document.getElementById('image').files[0];

    const sightData = {
        identification: identification,
        description: description,
        date: date,
        user_name: 'your_username', // Update with your own username
        location: location,
        image: image
    };

    await fetch('/saveSighting', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sightData)
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

async function sortByDate(){
    const response = await fetch('/sortByDate', { method: 'GET' })
    const stringPromise = response.text();
    document.write(await stringPromise);

}

