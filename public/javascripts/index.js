function showCreate(){
    var modal = document.getElementById("addSight");
    modal.style.display = "block";
}

function closeModal(){
    var modal = document.getElementById("addSight");
    modal.style.display = "none";
}

// upload image
function uploadImage(event) {
    var image = event.target.files[0];
    var imagePreview = document.getElementById("image-preview");
    var reader = new FileReader();
    reader.onload = function() {
        imagePreview.src = reader.result;
    };
    reader.readAsDataURL(image);
    var formData = new FormData();
    formData.append("image", image);
    axios.post("/upload-image", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }).then(function(response) {
        console.log(response.data);
    }).catch(function(error) {
        console.error(error);
    });
}