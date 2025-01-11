const loginForm = document.getElementById('login-form');
async function validateCredentials(formData, e){
    try{
        const res = await fetch('http://localhost:3000/login', 
            {
                method: 'POST', 
                body: formData
            })
        
        if (res.status === 401){
            e.preventDefault();
            alert('Invalid Creds');
            return;
        }

        if (res.status === 200){
            alert(`LOGGED IN`)
        }
        
    } catch (err){
        alert('Something went wrong');
        console.error(`My err: ${err}`)
    }
}


loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    validateCredentials(formData, e);
});

