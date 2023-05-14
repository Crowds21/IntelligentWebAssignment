
function setUsername(username) {
    document.getElementById("navbar-username").innerHTML = username
}

function showUserSetting() {
    document.getElementById("user-setting-dialog").style.display = "block"
}

function closeUserSetting() {
    document.getElementById("user-setting-dialog").style.display = "none"
}
document.getElementById("user-setting-submit").addEventListener('click', function () {
    closeUserSetting()
    let username= document.getElementById("user-setting-input").value;
    let newUser = {
        username: username,
        deviceId: generateDeviceId()
    }
    updateSingleton(newUser, user_store, function (data, newData) {
        data.username = newData.username
    }).then(() => {
        console.log("Update Successfully")
    })
    setUsername(username)
})
document.getElementById("user-setting-btn").addEventListener('click', function () {
    showUserSetting()
})
document.getElementById("user-setting-cancel").addEventListener('click', function () {
    closeUserSetting()
})