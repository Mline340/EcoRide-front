
function initInformationPage() {
    const btnMaj = document.getElementById("btnMaj");
    
    if (!btnMaj) {
        console.error("Bouton btnMaj non trouvé");
        return;
    }
    
    btnMaj.addEventListener("click", checkCredentials);
    console.log("Event listener ajouté au bouton"); // Pour déboguer
}

function checkCredentials(event) {
    event.preventDefault();
    
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert("Vous devez être connecté pour effectuer cette action");
        return;
    }
    
    console.log("Fonction checkCredentials appelée");

    
    // Récupérer les valeurs des champs
    const passager = document.getElementById("passagerInput").checked;
    const chauffeur = document.getElementById("chauffeurInput").checked;
    const paschau = document.getElementById("paschauInput").checked;
    const animaux = document.getElementById("animauxInput").checked;
    const fumeur = document.getElementById("fumeurInput").checked;
    const nbr_place = document.getElementById("placeInput").value;
    const message = document.getElementById("messageInput").value;
    
    console.log("Données à envoyer:", { passager, chauffeur, paschau, animaux, fumeur, nbr_place, message });
    console.log("🚀 Appel de envoyerDonnees()"); 
    envoyerDonnees(token, passager, chauffeur, paschau, animaux, fumeur, nbr_place, message);
    console.log("✅ envoyerDonnees() appelée"); 

}

function envoyerDonnees(token, passager, chauffeur, paschau, animaux, fumeur, nbr_place, message) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
     myHeaders.append("Authorization", `Bearer ${token}`);
    
    const data = {
        "passager": passager,
        "chauffeur": chauffeur,
        "pas_chau": paschau,
        "animaux": animaux,
        "fumeur": fumeur,
        "nbr_place": nbr_place,
        "message": message
      
    };
    
    const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(data),
        redirect: "follow"
    };
    
    const userId = localStorage.getItem("userId");
    
    const endpoint = `http://localhost:8000/api/preference/${userId}`;
    
    console.log("🔗 Endpoint appelé:", endpoint); // Pour vérifier l'URL
    console.log("📦 Données envoyées:", data); // Pour vérifier les données
 

    fetch(endpoint, requestOptions)
        .then((response) => {
            console.log("📨 Statut réponse:", response.status);
    
            
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
                return response.text(); 
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
