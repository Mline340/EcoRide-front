function initInformationPage() {    
    const btnAjoutVoiture = document.getElementById("btn-validation-voiture");
    
    if (!btnAjoutVoiture) {
        console.error("❌ Bouton non trouvé, attente...");
        // Attendre que le bouton apparaisse
        waitForElement("btn-validation-voiture", function(btn) {
            console.log("✅ Bouton finalement trouvé !");
            attachEventListener(btn);
        });
        return;
    }
    
    console.log("✅ Bouton trouvé immédiatement !");
    attachEventListener(btnAjoutVoiture);
}

function attachEventListener(btnAjoutVoiture) {
    btnAjoutVoiture.addEventListener("click", function(e) {
        e.preventDefault();
        console.log("🔘 CLIC détecté");
        
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.error("❌ Token non trouvé");
            alert("Vous devez être connecté pour ajouter un véhicule");
            return;
        }
        
        const modele = document.getElementById('modele')?.value;
        const immatriculation = document.getElementById('immatriculation')?.value;
        const energie = document.getElementById('energie')?.value;
        const couleur = document.getElementById('couleur')?.value;
        const dateImma = document.getElementById('dateImma')?.value;
        
        console.log("📋 Données:", {modele, immatriculation, energie, couleur, dateImma});
        
        AjoutVoiture(token, modele, immatriculation, energie, couleur, dateImma);
    });
    
    console.log("✅ Event listener ajouté");
}

// Fonction utilitaire pour attendre qu'un élément apparaisse
function waitForElement(elementId, callback) {
    const checkExist = setInterval(function() {
        const element = document.getElementById(elementId);
        if (element) {
            console.log("⏰ Élément détecté après attente");
            clearInterval(checkExist);
            callback(element);
        }
    }, 100); // Vérifier toutes les 100ms
    
    // Timeout après 5 secondes
    setTimeout(function() {
        clearInterval(checkExist);
        console.error("⏰ Timeout : élément non trouvé après 5 secondes");
    }, 5000);
}

function AjoutVoiture(token, modele, immatriculation, energie, couleur, dateImma) {
    console.log("📤 Envoi à l'API...");
    
    console.log("📦 Valeurs individuelles:", {
        modele, 
        immatriculation, 
        energie, 
        couleur, 
        dateImma
    });

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    
    const body = JSON.stringify({
        modele: modele,
        immatriculation: immatriculation,
        energie: energie,
        couleur: couleur,
        datePremiereImmatriculation: dateImma
    });
    
    fetch(`http://localhost:8000/api/voiture/${userId}`, {
        method: 'POST',
        headers: myHeaders,
        body: body
    })
    .then(response => {
    console.log("📥 Réponse:", response.status);
    
    // ✅ AJOUTEZ CECI pour voir le message d'erreur
    return response.json().then(data => {
        if (!response.ok) {
            console.error("❌ Erreur serveur:", data);
            throw new Error(data.error || `Erreur HTTP: ${response.status}`);
        }
        return data;
    });
   })
    .then(data => {
        console.log("✅ Succès:", data);
        alert("Véhicule ajouté avec succès !");
    })
    .catch(error => {
        console.error("❌ Erreur:", error);
        alert("Erreur: " + error.message);
    });
}

// Appel immédiat
initInformationPage();

// Fonction pour le router
window.onPageLoadedInformation = function () {
    console.log("🟢 Router callback");
    initInformationPage();
};