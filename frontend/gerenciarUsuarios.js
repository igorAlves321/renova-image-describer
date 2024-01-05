const apiUrl = 'http://localhost:3000/user';

// Função para obter usuários
async function getUsers() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/read`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Falha ao obter usuários');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao obter usuários:', error);
        return { totalUsers: 0, users: [] };
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
async function refreshUserList() {
    const { totalUsers, users } = await getUsers();
    const userListDiv = document.getElementById('userList');
    const userCountDiv = document.getElementById('userCount');
    
    userListDiv.innerHTML = '';
    userCountDiv.textContent = `Total de Usuários: ${totalUsers}`;

    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('user-item');

        userDiv.innerHTML = `
            <p>Nome: ${user.name}</p>
            <p>Email: ${user.email}</p>
            <button onclick="deleteUser('${user.id}')">Deletar ${user.name}</button>
            <button onclick="editUser('${user.id}')">Editar ${user.name}</button>
        `;

        userListDiv.appendChild(userDiv);
    });
}

document.addEventListener('DOMContentLoaded', refreshUserList);
