async function initPage() {
    let user = await isUserExist()
    let username = user.username
    setUsername(username)
}

function setUsername(username) {
    document.getElementById("navbar-username").innerHTML = username
}