document.addEventListener('DOMContentLoaded', () => {
    const userGreeting = document.getElementById('userGreeting');
    if (userGreeting) {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            userGreeting.textContent = `Olá, ${payload.name || 'Usuário'}`;
        }
    }
});
