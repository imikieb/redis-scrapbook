const username = document.getElementById('name');
const password = document.getElementById('password');
const registerButton = document.getElementById('register-button');
const loginButton = document.getElementById('login-button');
const redirectButton = document.getElementById('redirect-button');
const errorFill = document.getElementById('error-fill');

redirectButton.disabled = true;

axios.defaults.baseURL = 'http://localhost:8080';

function loginUser(event) {
    event.preventDefault();
    localStorage.setItem('userList', username.value);
    axios.post('/login', {
        name: username.value,
        password: password.value
    })
    .then(response => {
        errorFill.innerHTML = '';
        loginButton.style.display = 'none';
        redirectButton.style.display = 'block';
        setTimeout(() => window.location.href = '/notes.html', 3000);
    })
    .catch(error => {
        errorFill.style.display = 'block';
        errorFill.innerHTML = error.response.data.message;
    });
}