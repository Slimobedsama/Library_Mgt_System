const form = document.querySelector('#form');
let email = document.querySelector('#email');
let emailError = document.querySelector('.email-error');
let successMsg = document.querySelector('.msg-sent');

form.addEventListener('submit', async(e)=> {
    e.preventDefault();
    // SET FORM DATA
    email = form.email.value;
    // CLEARS ERROR MESSAGE
    emailError.textContent = '';
    successMsg.textContent = '';

    try {
        const res = await fetch('/api/admins/forgotten-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });
        const data = await res.json();
        
        if(data.userId) {
           successMsg.textContent = data.message;
        }
    
        if(data && data.message.includes('Email is required') || data && data.message.includes('email is not found')) {
            emailError.textContent = data.message;
        }
        
    } catch (error) {
        console.error(error);
    }
});