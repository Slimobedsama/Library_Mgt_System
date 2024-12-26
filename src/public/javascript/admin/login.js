let password = document.querySelector('#password');
let toggleEye = document.querySelector('.fa-eye');
const form = document.querySelector('#form');
let email = document.querySelector('#email');
let emailError = document.querySelector('.email-error');
let passwordError = document.querySelector('.password-error');

function passwordVisiblity() {
    const passwordInput = document.querySelector('#password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleEye.classList.remove('fa-eye');
        toggleEye.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleEye.classList.remove('fa-eye-slash');
        toggleEye.classList.add('fa-eye');
    }
}

async function loginForm(e) {
    e.preventDefault();

    email = form.email.value;
    password = form.password.value;
    // CLEARS ERROR MESSAGES
    emailError.textContent = '';
    passwordError.textContent = '';

    try {
        const response = await fetch('/api/admins/login', {
            method: 'POST',
            headers: { 'content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if(data.Admin) {
            location.assign('/api/admins/dashboard');
        }

        if(data.errors.includes('This Email')) {
            emailError.textContent = data.errors;
        } else if(data.errors.includes('Incorrect Password')) {
            passwordError.textContent = data.errors;
        }
    } catch (err) {
        console.log(err);
    }
}

// EVENT LISTENERS
toggleEye.addEventListener('click', passwordVisiblity);
form.addEventListener('submit', loginForm);