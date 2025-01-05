let password = document.querySelector('#password');
let toggleEye = document.querySelector('.fa-eye');
const form = document.querySelector('#form');
let email = document.querySelector('#email');
let emailMsg = document.querySelector('.email-msg');
let passwordMsg = document.querySelector('.password-msg');

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
    emailMsg.textContent = '';
    passwordMsg.textContent = '';

    try {
        const response = await fetch('/api/admins/login', {
            method: 'POST',
            headers: { 'content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if(data.Admin) {
            location.assign('/api/admins/dash-board');
        }

        if(data && data.errors) {
            for(error of data.errors) {
             if(error.includes('Email')) {
                 emailMsg.textContent = error;
             } else if(error.includes('Password')) {
                 passwordMsg.textContent = error;
             }
            }
        }

        if (data && data.message) {
            if(data.message.includes('email does not')) {
                emailMsg.textContent = data.message;
            } else if(data.message.includes('Incorrect password')) {
                passwordMsg.textContent = data.message;
            }
        }
    } catch (err) {
        console.log(err);
    }
}

// EVENT LISTENERS
toggleEye.addEventListener('click', passwordVisiblity);
form.addEventListener('submit', loginForm);