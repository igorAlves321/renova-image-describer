//Criar áudio e carregar no buffer
let musicLoop = new Audio
musicLoop.src = "loop.mp3"
musicLoop.loop = true
musicLoop.volume = 0.3

let btnAddImage = document.getElementById("btnAddFile")
let contentImage = ""
let dvResultado = document.getElementById("resultado")
let fileImage = document.getElementById("fileImage")

btnAddImage.addEventListener("click", imageEvents)

function imageEvents() {

    let inptImage = document.getElementById("inptFile")

    inptImage.click()
    inptImage.addEventListener("change", readImage, false)


    async function readImage() {
        let fr = new FileReader()

        fr.onload = async function (event) {

            fileImage.src = event.target.result
            contentImage = fileImage.src
            const json = {
                image: contentImage
            }
            musicLoop.play()
            dvResultado.innerHTML = "Processando..."
            try {
                const result = await fetch("http://localhost:3000", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(json)
                })

                let data = await result.json()
                data = data.data
                fileImage.setAttribute("alt", data)
                dvResultado.innerHTML = ""
            } catch (err) {
                console.log("Erro ao obter informações do servidor")
                dvResultado.innerHTML = "Erro ao obter informações do servidor."
            }

            musicLoop.pause()
            musicLoop.currentTime = 0

        }
        fr.readAsDataURL(this.files[0])
    }
}

fileImage.addEventListener("click", (() => {
    navigator.clipboard.writeText(fileImage.alt)
}))
