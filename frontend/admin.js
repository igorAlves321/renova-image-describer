const apiUrl = 'http://localhost:3000/user';

// Função para cadastrar usuário
async function addUser(userData) {
    try {
        const response = await fetch(`${apiUrl}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error('Falha ao adicionar usuário');
        }
        refreshUserList();
    } catch (error) {
        console.error('Erro ao adicionar usuário:', error);
    }
}


async function getUsers() {
    try {
        const response = await fetch(`${apiUrl}/read`);
        if (!response.ok) {
            throw new Error('Falha ao obter usuários');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao obter usuários:', error);
        return [];
    }
}

// Função para obter um usuário pelo ID
async function getUserById(userId) {
    try {
        const response = await fetch(`${apiUrl}/${userId}`);
        if (!response.ok) {
            throw new Error('Falha ao obter usuário');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao obter usuário:', error);
        return null;
    }
}

// Função para atualizar usuário
async function updateUser(userId, userData) {
    try {
        const response = await fetch(`${apiUrl}/update/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error('Falha ao atualizar usuário');
        }
        refreshUserList();
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
    }
}

// Função para deletar usuário
async function deleteUser(userId) {
    try {
        const response = await fetch(`${apiUrl}/delete/${userId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Falha ao deletar usuário');
        }
        refreshUserList();
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
    }
}

// Função para atualizar a lista de usuários
async function refreshUserList() {
    const users = await getUsers();
    const userListDiv = document.getElementById('userList');
    userListDiv.innerHTML = '';

    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('user-item');
        userDiv.innerHTML = `
            <span>${user.name}</span>
            <button onclick="toggleMenu('${user.id}')" aria-label="Ações para ${user.name}">Ações</button>
            <div id="menu-${user.id}" class="action-menu" style="display: none;">
                <button onclick="editUser('${user.id}')" aria-label="Alterar ${user.name}">Alterar</button>
                <button onclick="deleteUser('${user.id}')" aria-label="Excluir ${user.name}">Excluir</button>
            </div>
        `;
        userListDiv.appendChild(userDiv);
    });
}

function toggleMenu(userId) {
    const menu = document.getElementById(`menu-${userId}`);
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// Função para editar usuário
async function editUser(userId) {
    try {
        const user = await getUserById(userId);
        if (user) {
            document.getElementById('editUserId').value = user.id;
            document.getElementById('editName').value = user.name;
            document.getElementById('editEmail').value = user.email;

            var editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
            editModal.show();
        } else {
            throw new Error('Usuário não encontrado');
        }
    } catch (error) {
        console.error('Erro ao editar usuário:', error);
    }
}

// Função para salvar as alterações do usuário
async function saveUserChanges() {
    const userId = document.getElementById('editUserId').value;
    const updatedUserData = {
        name: document.getElementById('editName').value,
        email: document.getElementById('editEmail').value,

    };

    try {

        await updateUser(userId, updatedUserData);
        var editModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
        editModal.hide();
        refreshUserList();
    } catch (error) {
        console.error('Erro ao salvar as alterações do usuário:', error);
    }
}

// Manipuladores de eventos para o formulário de adição de usuário
document.getElementById('addUserForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'), 
    };
    addUser(userData);
});

// Iniciar a lista de usuários ao carregar a página
document.addEventListener('DOMContentLoaded', refreshUserList);

