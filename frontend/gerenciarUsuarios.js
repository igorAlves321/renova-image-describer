
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

// Função para obter usuários
async function getUsers(filter = '') {
    try {
        const token = localStorage.getItem('token');
        let url = `${apiUrl}/read`;
        if (filter) {
            url += `?status=${filter}`;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Falha ao obter usuários');
        }

        const users = await response.json();
        return users; // Retorna diretamente o array de usuários
    } catch (error) {
        console.error('Erro ao obter usuários:', error);
        return []; // Retorna um array vazio em caso de erro
    }
}

// Função para mostrar/ocultar o menu de contexto
function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Função para ativar um usuário
async function activateUser(userId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/activate/${userId}`, {
            method: 'PUT',  // Ou 'POST', dependendo de como sua API está configurada
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Falha ao ativar usuário');
        }
        alert('Usuário ativado com sucesso!');
        refreshUserList();
    } catch (error) {
        console.error('Erro ao ativar usuário:', error);
        alert('Erro ao ativar usuário.');
    }
}

// Função para atualizar usuário
async function updateUser(userId, userData) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/update/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error('Falha ao atualizar usuário');
        }
        alert('Usuário atualizado com sucesso!');
        refreshUserList();
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        alert('Erro ao atualizar usuário.');
    }
}

// Função para deletar usuário
async function deleteUser(userId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/delete/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Falha ao deletar usuário');
        }
        alert('Usuário deletado com sucesso!');
        refreshUserList();
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        alert('Erro ao deletar usuário.');
    }
}

// Função para editar um usuário
async function editUser(userId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Falha ao obter informações do usuário');
        }
        const user = await response.json();

        document.getElementById('editUserId').value = user.id;
        document.getElementById('editName').value = user.name;
        document.getElementById('editEmail').value = user.email;

        var editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
        editModal.show();
    } catch (error) {
        console.error('Erro ao editar usuário:', error);
    }
}

// Função para salvar as alterações do usuário
async function saveUserChanges() {
    const userId = document.getElementById('editUserId').value;
    const updatedUserData = {
        name: document.getElementById('editName').value,
        email: document.getElementById('editEmail').value
        // Adicione outros campos conforme necessário
    };

    await updateUser(userId, updatedUserData);
    var editModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
    editModal.hide();
}

// Função para exibir a lista de usuários
async function refreshUserList(filter = '') {
    const users = await getUsers(filter);
    const userListDiv = document.getElementById('userList');
    userListDiv.innerHTML = '';

    if (Array.isArray(users)) {
        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.classList.add('user-item');

            userDiv.innerHTML = `
                <p>Nome: ${user.name}</p>
                <p>Email: ${user.email}</p>
                <button class="acoes-btn" onclick="toggleMenu('menu-${user.id}')">Mais Ações</button>
                <div class="acoes-menu" id="menu-${user.id}">
                    ${user.status !== 'ACTIVE' ? `<a href="#" onclick="activateUser('${user.id}')">Ativar Usuário</a>` : ''}
                    <a href="#" onclick="deleteUser('${user.id}')">Excluir Usuário</a>
                    <a href="#" onclick="editUser('${user.id}')">Alterar Usuário</a>
                </div>
            `;

            userListDiv.appendChild(userDiv);
        });
    } else {
        console.error('Esperava-se um array, mas o tipo recebido foi:', typeof users);
        // Opcional: exibir uma mensagem no UI para informar que não há usuários ou ocorreu um erro
    }
}

function setupFilterButtons() {
    document.getElementById('filterAll').addEventListener('click', () => refreshUserList(''));
    document.getElementById('filterActive').addEventListener('click', () => refreshUserList('ACTIVE'));
    document.getElementById('filterInactive').addEventListener('click', () => refreshUserList('INACTIVE'));
}

document.addEventListener('DOMContentLoaded', () => {
    refreshUserList(); // Carrega inicialmente todos os usuários
    setupFilterButtons(); // Configura os event listeners para os botões de filtro
});



