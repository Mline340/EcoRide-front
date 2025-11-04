const mailInput = document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput"); 
const btnSignin = document.getElementById("btnSignin"); 
const signinForm =document.getElementById("signinForm"); 

btnSignin.addEventListener("click", checkCredentials); 

function checkCredentials(){ 
    let dataForm = new FormData(signinForm); 
    
    const myHeaders = new Headers(); 
    myHeaders.append("Content-Type", "application/json"); 
    const raw = JSON.stringify({
         "email": dataForm.get("email"),
         "password": dataForm.get("password")
     }); 
    
     const requestOptions = { 
        method: "POST", 
        headers: myHeaders, 
        body: raw, 
        redirect: "follow" 
    }; 
    
    fetch(apiUrl+"login", requestOptions) 
    .then(response => { 
        if(response.ok){ 
            return response.json(); 
        } 
        else{ 
            mailInput.classList.add("is-invalid"); 
            passwordInput.classList.add("is-invalid"); 
        } 
    }) 
    .then(result => { 
        // Il faudra récupérer le vrai token 
        const token = result.apiToken; 
        setToken(token); 
        //placer ce token en cookie 
        
        // Stockage de l'userId 
        if (result.userId) { localStorage.setItem("userId", result.userId); 
            console.log("UserId stocké:", result.userId); 
        } else if (result.id) { 
            // Au cas où votre API renvoie "id" au lieu de "userId"
             localStorage.setItem("userId", result.id); 
             console.log("UserId stocké:", result.id);
             } else { 
                console.warn("⚠️ Aucun userId trouvé dans la réponse de l'API");
        } 
        
        setCookie(RoleCookieName, result.roles, 7);
        window.location.replace("/"); }) 
        .catch(error => console.log('error', error));
    }