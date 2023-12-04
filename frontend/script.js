//Criar áudio e carregar no buffer
const musicLoop = new Audio
musicLoop.src = "loop.mp3"
musicLoop.loop = true
musicLoop.volume = 0.3

const btnAddImage = document.getElementById("btnAddFile")
const dvResult = document.getElementById("result")
const fileImage = document.getElementById("fileImage")
const btnCopyText = document.getElementById("btnCopyText")

btnAddImage.addEventListener("click", imageEvents)

function imageEvents() {

    const inptImage = document.getElementById("inptFile")

    inptImage.click()
    inptImage.addEventListener("change", readImage, false)


    async function readImage() {
        let fr = new FileReader()

        fr.onload = async function (event) {

            fileImage.src = event.target.result
            const json = {
                image: fileImage.src
            }
            musicLoop.play()
        dvResult.innerHTML = "Processando..."
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
            dvResult.innerHTML = ""
                btnCopyText.style.display = "block"
            } catch (err) {
                console.log("Erro ao obter informações do servidor")
                btnCopyText.style.display = "none"
            dvResult.innerHTML = "Erro ao obter informações do servidor."
            fileImage.src = ""
            }

            musicLoop.pause()
            musicLoop.currentTime = 0

        }
        fr.readAsDataURL(this.files[0])
        
        setTimeout(() => {
            btnAddImage.focus()
        }, 600)
    }
}

btnCopyText.addEventListener("click", function() {
    if (!fileImage.alt) {
    dvResult.innerHTML = "Selecione uma imagem"
        setTimeout(() => {
        dvResult.innerHTML = ""
        }, 5000)
    } else {
        navigator.clipboard.writeText(fileImage.alt)
    dvResult.innerHTML = "Texto copiado!"
        setTimeout(() => {
        dvResult.innerHTML = ""
        }, 5000)
    }
})
