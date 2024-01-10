const apiUrl = 'http://localhost:3000';

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

// Função para realizar o logout do usuário
function logoutUser() {
    // Remove o token de autenticação do armazenamento local
    localStorage.removeItem('token');

    // Redireciona para a página de login
    window.location.href = 'login.html'; // Substitua 'login.html' pelo caminho correto da sua página de login
}

// Função para verificar se o usuário é um administrador e mostrar a seleção de papel
function showRoleSelectionIfAdmin() {
    const token = localStorage.getItem('token');
    if (token) {
        const userRole = getUserRoleFromToken(token);
        if (userRole === 'admin') {
            document.getElementById('roleSelection').style.display = 'block';
        }
    }
}

// Função para adicionar usuário
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
        const userInfo = await response.json();
        showMessage('Usuário cadastrado com sucesso!', 'success');

        // Redireciona usuários não-administradores para describer.html
        if (userInfo.role !== 'admin') {
            window.location.href = 'describer.html';
        }
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        showMessage('Erro ao cadastrar usuário.', 'danger');
    }
}

// Função para realizar o login do usuário
async function loginUser(email, password) {
    try {
        const response = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            throw new Error('Falha no login');
        }
        const data = await response.json();
        localStorage.setItem('token', data.token);

        const userRole = getUserRoleFromToken(data.token);
        if (userRole === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'describer.html';
        }
        showMessage('Login realizado com sucesso!', 'success');
    } catch (error) {
        console.error('Erro no login:', error);
        showMessage('Erro no login.', 'danger');
    }
}

// Função para decodificar o token JWT e obter o papel do usuário
function getUserRoleFromToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    return payload.role;
}

// Event Listeners para os formulários de cadastro e login
document.addEventListener('DOMContentLoaded', () => {
    const addUserForm = document.getElementById('addUserForm');
    const loginForm = document.getElementById('loginForm');
    const logoutButton = document.getElementById('logoutButton');

    if (addUserForm) {
        showRoleSelectionIfAdmin();
        addUserForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                role: formData.get('role') || 'user'
            };
            addUser(userData);
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            loginUser(email, password);
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }
});
