const form = document.querySelector('form');

async function sendCredentials(formData, e){
    try{
        const res = await fetch('http://localhost:3000/login', 
            {
                method: 'POST', 
                body: formData
            })
        
        if (res.status !== 200){
            e.preventDefault();
            alert('Invalid Creds');
            return;
        } else{
            alert('VALID CREDS')
        }

        
    } catch (err){
        alert('Something went wrong');
        console.error(`My err: ${err}`)
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    sendCredentials(formData, e);
})