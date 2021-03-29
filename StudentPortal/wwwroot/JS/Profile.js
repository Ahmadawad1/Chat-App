$(document).ready(function () {

    $("#ChangeImageButton").click(function () {
        var file = document.getElementById("uploaded").files[0];

        if (file != null) {
            if (file.size < (1024 * 1024 * 4)) {

                $("#ChangeImage").submit();

            }
            else {
                document.getElementById("ImageError").innerHTML = "Image is Large , must be less than 4MB";

            }
        }
    });

});