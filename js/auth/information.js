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
    
    // Récupérer les valeurs des champs
    const telephone = document.getElementById("telInput").value;
    const codePostal = document.getElementById("codeInput").value;
    const ville = document.getElementById("VilleInput").value;
    const photoInput = document.getElementById("photo");
    const photoFile = photoInput ? photoInput.files[0] : null;
    
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoBase64 = e.target.result;
            envoyerDonnees(token, telephone, codePostal, ville, photoBase64);
        };
        reader.readAsDataURL(photoFile);
    } else {
        envoyerDonnees(token, telephone, codePostal, ville, null);
    }
}

function envoyerDonnees(token, telephone, codePostal, ville, photo) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    
    const data = {
        "telephone": telephone,
        "ville": ville,
        "code_postal": codePostal
    };
    
    if (photo) {
        data.photo = photo;
    }
    
    const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(data),
        redirect: "follow"
    };
    
    // Récupérer l'ID depuis localStorage
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
        alert("Erreur : ID utilisateur non trouvé. Veuillez vous reconnecter.");
        return;
    }
    
    const endpoint = `http://127.0.0.1:8000/api/utilisateur/${userId}`;
 

    fetch(endpoint, requestOptions)
        .then((response) => {
            console.log("📨 Statut réponse:", response.status);
            console.log("📨 Headers réponse:", response.headers);
            
            // Vérifier si la réponse a du contenu
            const contentType = response.headers.get("content-type");
            
            if (!response.ok) {
                // Si erreur, essayer de lire le texte brut
                return response.text().then(text => {
                    console.error("❌ Réponse erreur (texte brut):", text);
                    throw new Error(`Erreur HTTP ${response.status}: ${text || 'Pas de détails'}`);
                });
            }
            
            // Si succès mais pas de contenu JSON
            if (!contentType || !contentType.includes("application/json")) {
                console.log("✅ Succès (pas de JSON)");
                return response.text(); // Lire comme texte
            }
            
            return response.json();
        })
        .then((result) => {
            console.log("✅ Succès:", result);
            alert("Modification effectuée avec succès!");
        })
        .catch((error) => {
            console.error("❌ Erreur complète:", error);
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