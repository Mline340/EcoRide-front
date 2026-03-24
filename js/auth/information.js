function initInformationPage() {
    const btnMaj = document.getElementById("btnMaj");
    const photoInput = document.getElementById("photo");
    const preview = document.getElementById("preview");
    

    // Aperçu de la photo
    if (photoInput) {
        photoInput.addEventListener("change", function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (preview) {
                        preview.src = e.target.result;
                        preview.style.display = "block";
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Gestionnaire de clic sur le bouton
    btnMaj.addEventListener("click", checkCredentials);
}

function checkCredentials(event) {
    event.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Vous devez être connecté pour effectuer cette action");
        return;
    }
    
    const telephone  = document.getElementById("telInput").value;
    const codePostal = document.getElementById("codeInput").value;
    const ville      = document.getElementById("VilleInput").value;
    const photoInput = document.getElementById("photo");
    const photoFile  = photoInput ? photoInput.files[0] : null;

    
    const formData = new FormData();
    formData.append("telephone", telephone);
    formData.append("code_postal", codePostal);
    formData.append("ville", ville);
    
    if (photoFile) {
        formData.append("photo", photoFile); 
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert("Erreur : ID utilisateur non trouvé. Veuillez vous reconnecter.");
        return;
    }

    fetch(`http://127.0.0.1:8000/api/utilisateur/${userId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`
            
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Erreur HTTP ${response.status}: ${text}`);
            });
        }
        return response.json();
    })
    .then(result => {
        console.log("✅ Succès:", result);
        alert("Modification effectuée avec succès!");
    })
    .catch(error => {
        console.error("❌ Erreur:", error);
        alert("Erreur lors de la modification: " + error.message);
    });
}
// Fonction appelée par le router
window.onPageLoadedInformation = function () {
    console.log("✅ HTML de la page Information injecté → Init…");
    initInformationPage();
};

// Fallback si le router n'appelle pas onPageLoadedInformation
initInformationPage();