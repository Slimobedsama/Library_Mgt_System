const modalBtn = document.getElementById('add-librarian');
const openModalBtn = document.getElementById('open-modal');
const closeModalBtn = document.getElementById('close-modal');
const errorOpenModalBtn = document.querySelector('.modal-submit');
const firstName = document.querySelector('[name="firstName"]');
const lastName = document.querySelector('[name="lastName"]');
const email = document.querySelector('[name="email"]');
const links = document.querySelectorAll('.nav-links')


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

    e.target.value = value.split(' ').map(word => {
        if(word.length > 0) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word
    })
    .join(' ');
});

firstName.addEventListener('input', (e)=> {
    const value = e.target.value;

    e.target.value = value.split(' ').map(word => {
        if(word.length > 0) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word
    })
    .join(' ');
});

links.forEach(link => {
    link.addEventListener('click', function() {
        links.forEach( linked => linked.classList.remove('active'));
        this.classList.add('active')
    })
});