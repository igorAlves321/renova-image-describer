// Criar áudio e carregar no buffer
const musicLoop = new Audio();
musicLoop.src = "loop.mp3";
musicLoop.loop = true;
musicLoop.volume = 0.3;

const btnAddImage = document.getElementById("btnAddFile");
const dvResult = document.getElementById("result");
const dvDescricao = document.getElementById("dvDescricao");
const fileImage = document.getElementById("fileImage");
const btnCopyText = document.getElementById("btnCopyText");
const btnSaveDescription = document.getElementById("btnSaveDescription");
const modalImageTitle = document.getElementById("modalImageTitle"); // Campo para o título da imagem no modal

btnAddImage.addEventListener("click", imageEvents);

function imageEvents() {
    const inptImage = document.getElementById("inptFile");
    inptImage.click();
    inptImage.addEventListener("change", readImage, false);
}

async function readImage(inputElement = null) {
    let file;
    if (inputElement && inputElement.files && inputElement.files[0]) {
        // Caso para upload de arquivo
        file = inputElement.files[0];
    } else if (this && this.files && this.files[0]) {
        // Caso para colagem de imagem
        file = this.files[0];
    } else {
        console.error("readImage foi chamada sem um arquivo válido.");
        return;
    }

    let fr = new FileReader();
    fr.onload = async function(event) {
        fileImage.src = event.target.result;
        const token = localStorage.getItem('token');
        
        if (!token) {
            dvResult.innerHTML = "Usuário não autenticado.";
            return;
        }

        const decoded = JSON.parse(atob(token.split('.')[1]));
        const userId = decoded.userId;

        const json = {
            image: fileImage.src,
            userId: userId,
            saveDescription: false
        };

        musicLoop.play();
        dvResult.innerHTML = "Processando...";
        try {
            const result = await fetch("http://localhost:3000/image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(json)
            });

            let data = await result.json();
            data = data.data;
            dvDescricao.innerHTML = data;
            dvResult.innerHTML = "";
            btnCopyText.style.display = "block";
            btnSaveDescription.style.display = "block";
        } catch (err) {
            console.log("Erro ao obter informações do servidor");
            btnCopyText.style.display = "none";
            btnSaveDescription.style.display = "none";
            dvResult.innerHTML = "Erro ao obter informações do servidor.";
            fileImage.src = "";
        }

        musicLoop.pause();
        musicLoop.currentTime = 0;
    };

    fr.readAsDataURL(file);
    
    setTimeout(() => {
        btnAddImage.focus();
    }, 600);
}

btnCopyText.addEventListener("click", function() {
    if (btnCopyText.style.display == "none") return;
    if (!dvDescricao.innerHTML) {
        dvResult.innerHTML = "Selecione uma imagem.";
        setTimeout(() => {
            dvResult.innerHTML = "";
        }, 5000);
    } else {
        navigator.clipboard.writeText(dvDescricao.innerHTML);
        dvResult.innerHTML = "Texto copiado!";
        setTimeout(() => {
            dvResult.innerHTML = "";
        }, 5000);
    }
});

btnSaveDescription.addEventListener("click", function() {
    if (btnSaveDescription.style.display == "none" || !dvDescricao.innerHTML) return;
    $('#titleModal').modal('show');
});

document.getElementById('saveTitle').addEventListener('click', async function() {
    const imageTitleValue = modalImageTitle.value;
    if (!imageTitleValue) {
        dvResult.innerHTML = "Por favor, insira um título para a descrição da imagem.";
        setTimeout(() => {
            dvResult.innerHTML = "";
        }, 5000);
        return;
    }

    const token = localStorage.getItem('token');
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const userId = decoded.userId;

    const json = {
        image: fileImage.src,
        title: imageTitleValue,
        description: dvDescricao.innerHTML,
        userId: userId,
        saveDescription: true
    };

    try {
        const response = await fetch("http://localhost:3000/image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(json)
        });

        if (response.ok) {
            dvResult.innerHTML = "Descrição da imagem salva com sucesso!";
        } else {
            throw new Error("Falha ao salvar a descrição da imagem.");
        }
    } catch (err) {
        console.error("Erro ao salvar a descrição da imagem:", err);
        dvResult.innerHTML = "Erro ao salvar a descrição da imagem.";
    }

    setTimeout(() => {
        dvResult.innerHTML = "";
    }, 5000);

    $('#titleModal').modal('hide');
    modalImageTitle.value = '';
});

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

// Adicionando evento de colagem para capturar imagens da área de transferência
    document.getElementById('imagePasteArea').addEventListener('paste', (event) => {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        for (const item of items) {
            if (item.type.indexOf('image') === 0) {
                const blob = item.getAsFile();
                const fakeInputEvent = {
                    files: [blob]
                };
                readImage(fakeInputEvent);
            }
        }
    });
});
