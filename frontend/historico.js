document.addEventListener('DOMContentLoaded', () => {
    fetchHistorico();
});

async function fetchHistorico() {
    const apiUrl = 'http://localhost:3000/user'; // URL do endpoint do histórico
    const userId = getUserIdFromToken(); // Função para obter o ID do usuário do token

    try {
        const response = await fetch(`${apiUrl}/${userId}/images`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const historicoData = await response.json();
            displayHistorico(historicoData);
        } else {
            throw new Error('Falha ao obter histórico');
        }
    } catch (error) {
        console.error('Erro ao obter histórico:', error);
    }
}

function displayHistorico(historicoData) {
    const container = document.getElementById('historicoContainer');
    container.innerHTML = '';

    historicoData.forEach(item => {
        const link = document.createElement('a');
        link.href = '#';
        link.className = 'historicoLink';
        link.textContent = item.title;
        link.onclick = function (event) {
            event.preventDefault();
            openModal(item);
        };
        container.appendChild(link);
    });
}

function openModal(item) {
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');

    modalTitle.textContent = item.title;
    modalImage.src = item.imageUrl;
    modalDescription.textContent = item.description;

    // Substitua 'myModal' pelo ID do seu modal
    $('#myModal').modal('show');
}

function getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
    }
    return null;
}
