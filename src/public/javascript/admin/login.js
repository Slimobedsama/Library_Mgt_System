let password = document.querySelector('#password');
let toggleEye = document.querySelector('.fa-eye');

function passwordVisiblity() {
    if (password.type === 'password') {
        password.type = 'text';
        toggleEye.classList.remove('fa-eye');
        toggleEye.classList.add('fa-eye-slash');
    } else {
        password.type = 'password';
        toggleEye.classList.remove('fa-eye-slash');
        toggleEye.classList.add('fa-eye');
    }
}
toggleEye.addEventListener('click', passwordVisiblity);