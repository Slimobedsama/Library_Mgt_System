const modalBtn = document.getElementById('add-librarian');
const openModalBtn = document.getElementById('open-modal');
const closeModalBtn = document.getElementById('close-modal');
const errorOpenModalBtn = document.querySelector('.modal-submit');
const firstName = document.querySelector('[name="firstName"]');
const lastName = document.querySelector('[name="lastName"]');
const email = document.querySelector('[name="email"]');


openModalBtn.addEventListener('click', ()=> modalBtn.classList.remove('hidden'));
closeModalBtn.addEventListener('click', ()=> modalBtn.classList.add('hidden'));

modalBtn.addEventListener('click', (e)=> {
    if(e.target === modalBtn) {
        modalBtn.classList.add('hidden')
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const data = JSON.parse(document.getElementById("toast-data").textContent);
    const errors = data.error || [];

    if (errors.length > 0) {
        // open modal
        document.getElementById("add-librarian").classList.remove("hidden");
    }
});

lastName.addEventListener('input', (e)=> {
    const value = e.target.value;
    if(value.length > 0) {
        e.target.value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
});

firstName.addEventListener('input', (e)=> {
    const value = e.target.value;
    if(value.length > 0) {
        e.target.value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
});