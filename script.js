let btnAddImage = document.getElementById("btnAddFile")
let contentImage = ""

btnAddImage.addEventListener("click", imageEvents)

function imageEvents() {

    let inptImage = document.getElementById("inptFile")

    inptImage.click()
    inptImage.addEventListener("change", readImage, false)

    let fileImage = document.getElementById("fileImage")

    function readImage() {
        let fr = new FileReader()

        fr.onload = function (event) {

            fileImage.src = event.target.result
            contentImage = fileImage.src
            fileImage.removeAttribute("alt")

        }
        fr.readAsDataURL(this.files[0])
    }
}