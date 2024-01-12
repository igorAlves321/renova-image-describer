document.addEventListener('DOMContentLoaded', () => {
    fetchHistorico();
    document.getElementById('clearHistoryButton').addEventListener('click', clearHistory);
});

// Função para mostrar mensagens no contêiner
function showMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.textContent = message;
    messageContainer.className = `alert alert-${type}`;
    messageContainer.style.display = 'block';

    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 4000); // A mensagem será ocultada após 4 segundos
}

async function fetchHistorico() {
    const apiUrl = 'http://localhost:3000/user';
    const userId = getUserIdFromToken();

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
        showMessage('Erro ao obter histórico.', 'danger');
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

async function clearHistory() {
    const apiUrl = 'http://localhost:3000/user';
    const userId = getUserIdFromToken();

    try {
        const response = await fetch(`${apiUrl}/${userId}/clear-history`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            document.getElementById('historicoContainer').innerHTML = '';
            showMessage('Histórico limpo com sucesso.', 'success');
        } else {
            throw new Error('Falha ao limpar o histórico');
        }
    } catch (error) {
        console.error('Erro ao limpar o histórico:', error);
        showMessage('Erro ao limpar o histórico.', 'danger');
    }
}
