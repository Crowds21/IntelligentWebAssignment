async function initPage() {
    let user = await isDataExist(user_store)
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



