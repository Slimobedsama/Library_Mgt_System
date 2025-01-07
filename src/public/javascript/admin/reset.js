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

    password = form.password.value;
    // CLEARS ERROR MESSAGES
    passwordMsg.textContent = '';
    // GETS THE ID FROM THE CURRENT URL
    const id = location.pathname.split('/').pop();
    // SETS THE URL ON THE ACTION ATTRIBUTE OF THE FORM
    form.action = `/api/admins/reset-password/${id}`

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            headers: { 'content-Type': 'application/json'},
            body: JSON.stringify({ password })
        });
        const data = await response.json();
        
        if(data.admin) {
            location.assign('/api/admins/dash-board');
        }

        if(data && data.errors) {
            for(error of data.errors) {
             if(error.includes('Password')) {
                 passwordMsg.textContent = error;
             }
            }
        }

        if (data && data.message) {
            passwordMsg.textContent = data.message;
        }

    } catch (err) {
        console.log(err);
    }
}

// EVENT LISTENERS
toggleEye.addEventListener('click', passwordVisiblity);
form.addEventListener('submit', loginForm);