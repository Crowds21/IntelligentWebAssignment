async function initPage() {
    let user = await isUserExist()
    if (user) {
        let username = user.username
        setUsername(username)
    } else {
        // TODO Make the page unselectable when a dialog is popped up and set other content to gray
        showUserSetting()
    }
}

function showCreate() {
    var modal = document.getElementById("addSight");
    modal.style.display = "block";
}

function closeModal() {
    var modal = document.getElementById("addSight");
    modal.style.display = "none";
}

// upload image
function uploadImage(event) {
    var image = event.target.files[0];
    var imagePreview = document.getElementById("image-preview");
    var reader = new FileReader();
    reader.onload = function () {
        imagePreview.src = reader.result;
    };
    reader.readAsDataURL(image);
    var formData = new FormData();
    formData.append("image", image);
    axios.post("/upload-image", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }).then(function (response) {
        console.log(response.data);
    }).catch(function (error) {
        console.error(error);
    });
}

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
    let newUser = document.getElementById("user-setting-input").value;
    //
    updateUser(newUser).then(r => {
        console.log("Update username successfully")
    })
    // insertToStore(user_store, {username: newUser})
    setUsername(newUser)
})
document.getElementById("user-setting-btn").addEventListener('click', function () {
    showUserSetting()
})
document.getElementById("user-setting-cancel").addEventListener('click',function (){
    closeUserSetting()
})