const signUpForm = document.getElementById('signup-form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const btn = document.querySelector('button');


async function sendCredentials(formData, e){

    try {
        const res = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            body: formData
        })

        if (res.status === 409){
            e.preventDefault();
            alert('User already Exists');
            return;
        }

        if(res.status === 201){
            alert(`SUCCESS`)
        }
        
    } catch(err){
        alert('SOMETHING OCCURED DURING FETCH')
        console.error(`My error: ${err}`)
    }
};

signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(signUpForm);
    sendCredentials(formData, e);
    window.location.href = 'index.html'
} )