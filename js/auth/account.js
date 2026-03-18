function getToken() {
  return localStorage.getItem("token");
}

// Fonction principale pour charger le compte
async function loadAccountPage() {
  // Récupération du token et userId
  const token = getToken();
  const userId = localStorage.getItem("userId");


  // Vérification de la connexion - STOP si pas de token/userId
  if (!token || !userId) {
    console.error("❌ Authentification manquante -> redirection vers /signin");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/signin";
    return;
  }

  console.log("✅ Token et userId trouvés, appel API...");

  // Construction de l'URL avec l'ID utilisateur
  const endpoint = `http://127.0.0.1:8000/api/utilisateur/${userId}`;
  console.log("📡 URL API:", endpoint);

  try {
    // Appel API pour récupérer les infos utilisateur
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    console.log("📡 Statut réponse API:", response.status);
    
     if (response.status === 401) {
    console.error("❌ Token invalide/expiré (401)");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/signin";
    return;
    }

    
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log("✅ Données utilisateur reçues:", data);
    
    // Affichage des informations utilisateur
    const userInfoElement = document.getElementById("user-info");

     
    if (userInfoElement) {
      userInfoElement.innerHTML = `
        <div>
        <p><strong>Photo de profil : </strong>${data.photo 
        ? `<br><img src="${data.photo}" style="max-width: 200px; max-height: 200px; border-radius: 8px; margin-top: 10px;">` 
        : 'Non renseigné'}</p>
          <p><strong>Nom Prénom : </strong>${data.nom + " " + data.prenom || 'Non renseigné'}</p>
          <p><strong>Age : </strong>${data.date_naissance ? (() => {
            const aujourd_hui = new Date();
            const naissance = new Date(data.date_naissance);
            let age = aujourd_hui.getFullYear() - naissance.getFullYear();
            const mois = aujourd_hui.getMonth() - naissance.getMonth();
           if (mois < 0 || (mois === 0 && aujourd_hui.getDate() < naissance.getDate())) {
             age--;
          }
          return age + ' ans';
          })() : 'Non renseigné'}</p>
          <p><strong>Email : </strong>${data.email || 'Non renseigné'}</p>
          <p><strong>Pseudo : </strong>${data.pseudo || 'Non renseigné'}</p>
          <p><strong>Tel : </strong>${data.telephone || 'Non renseigné'}</p>
          <p><strong>Adresse : </strong>${data.code_postal + " " + data.ville || 'Non renseigné'}</p>
        </div>
      `;
      console.log("✅ Informations affichées");
    } else {
      console.error("❌ Élément #user-info introuvable dans le DOM");
    }
    
  } catch (error) {
    console.error("❌ ERREUR:", error);
    
    const userInfoElement = document.getElementById("user-info");
    if (userInfoElement) {
      userInfoElement.innerHTML = `
        <div style="padding: 20px; background: #fee; border-radius: 10px; color: #c33;">
          <p><strong>⚠️ Impossible de charger vos informations</strong></p>
          <p style="font-size: 0.9em; margin-top: 10px;">Erreur: ${error.message}</p>
        </div>
      `;
    }
  }
   try {
  const response = await fetch(`http://localhost:8000/api/preference/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  console.log("📡 Statut réponse API:", response.status);
  
  if (response.status === 401) {
    console.error("❌ Token invalide/expiré (401)");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/signin";
    return;
  }

  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status}`);
  }
  
  const data = await response.json();
  console.log("✅ Données utilisateur reçues:", data);
  console.log('=== DEBUT DEBUG ===');
  console.log('Données complètes:', data);
  console.log('nbr_place:', data.nbr_place);
  console.log('Type:', typeof data.nbr_place);
  console.log('=== FIN DEBUG ===');
  
  // AFFICHAGE DES DONNÉES
  const userPrefElement = document.getElementById("preference-info");
if (userPrefElement) {
  // Créer un tableau avec toutes les lignes possibles
  const lignes = [
    { label: 'Passager', value: data.passager === true ? 'Oui' : data.passager },
    { label: 'Chauffeur', value: data.chauffeur === true ? 'Oui' : data.chauffeur },
    { label: 'Passager / Chauffeur', value: data.PasChau === true ? 'Oui' : data.pas_chau },
    { label: 'Animaux', value: data.animaux === true ? 'J\'accepte les animaux' : data.animaux },
    { label: 'Fumeur', value: data.fumeur === true ? 'J\'accepte les fumeurs ' : data.fumeur },
    { label: 'Nombre de place', value: data.NbrPlace },
    { label: 'Message', value: data.message }
  ];


  // Filtrer et générer le HTML uniquement pour les valeurs renseignées
  const htmlLignes = lignes
    .filter(ligne => ligne.value !== null && 
                     ligne.value !== undefined && 
                     ligne.value !== false && 
                     ligne.value !== '')
    .map(ligne => `<p><strong>${ligne.label} : </strong>${ligne.value}</p>`)
    .join('');

  userPrefElement.innerHTML = `<div>${htmlLignes}</div>`;
  console.log("✅ Informations affichées");
} else {
  console.error("❌ Élément #preference-info introuvable dans le DOM");
}
} catch (error) {
  console.error("❌ ERREUR:", error);
}

     try {
    const response = await fetch(`http://localhost:8000/api/voiture/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    console.log("📡 Statut réponse API:", response.status);
    
     if (response.status === 401) {
    console.error("❌ Token invalide/expiré (401)");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/signin";
    return;
    }

    
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    
    
  
    const data = await response.json();
     if (data.length > 0) {
    console.log("📊 Première voiture complète:", JSON.stringify(data[0], null, 2));
    }
    console.log("✅ Données utilisateur reçues:", data);
    // Affichage les préférences utilisateur
    console.log("🔍 Tous les éléments avec un ID dans la page:");
    document.querySelectorAll("[id]").forEach(el => {
     console.log("  -", el.id);
});
    const userVoitureElement = document.getElementById("voiture-user");
        if (userVoitureElement) {
        // ✅ Vérifier si data est un tableau et non vide
        if (Array.isArray(data) && data.length > 0) {
            // Afficher toutes les voitures
            userVoitureElement.innerHTML = data.map(voiture => `
                <div class="voiture-item">
                    <p><strong>Modèle:</strong> ${voiture.modele + " " + voiture.immatriculation || 'Non renseigné'}</p>
                    <p><strong>Couleur:</strong> ${voiture.couleur || 'Non renseigné'}</p>
                    <p><strong>Énergie:</strong> ${voiture.energie || 'Non renseigné'}</p>
                    <p><strong>Date:</strong> ${voiture.date_premiere_immatriculation || 'Non renseigné'}</p>
                    <button onclick="supprimerVoiture(${voiture.id})" class="btn btn-danger btn-sm">
                     🗑️ Supprimer
                     </button>
                    <hr>
                </div>
            `).join('');
            console.log("✅ Informations affichées");
        } else {
            // Aucune voiture trouvée
            userVoitureElement.innerHTML = '<p>Aucun véhicule enregistré</p>';
            console.log(" Aucune voiture trouvée");
        }
    } else {
        console.error("❌ Élément #voiture-user introuvable dans le DOM");
    }
    
} catch (error) {
    console.error("❌ ERREUR:", error);
}
}
async function supprimerVoiture(id) {
    const token = localStorage.getItem("token");
    
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/voiture/${id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 204) {
            console.log("✅ Véhicule supprimé");
            alert("Véhicule supprimé avec succès !");
            // Recharger la liste des véhicules
            window.location.reload(); // ou rechargez juste la liste
        } else {
            const data = await response.json();
            alert("Erreur : " + (data.error || "Impossible de supprimer"));
        }
    } catch (error) {
        console.error("❌ Erreur:", error);
        alert("Erreur lors de la suppression");
    }
}
// Fonction exposée globalement pour être appelée depuis le HTML
window.supprimerMonCompte = async function() {
  console.log("🔴 Fonction de suppression appelée");
  
  const token = getToken();
  const userId = localStorage.getItem("userId");
  
  if (!token || !userId) {
    console.error("❌ Token ou userId manquant");
    alert("Erreur : informations de connexion manquantes");
    return;
  }
  
  // Confirmation avant suppression
  if (!confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
    console.log("❌ Suppression annulée par l'utilisateur");
    return;
  }

  const endpoint = `http://127.0.0.1:8000/api/utilisateur/${userId}`;
  console.log("📡 Envoi requête DELETE vers:", endpoint);

  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    console.log("📡 Réponse reçue, statut:", response.status);

    if (response.ok) {
      console.log("✅ Compte supprimé avec succès");
      // Nettoyage et redirection
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      alert("Votre compte a été supprimé avec succès");
      window.location.href = "/signin";
    } else {
      const errorText = await response.text();
      console.error("❌ Erreur lors de la suppression:", errorText);
      alert("Erreur lors de la suppression du compte : " + response.status);
    }
  } catch (error) {
    console.error("❌ Erreur:", error);
    alert("Une erreur est survenue lors de la suppression");
  }
};

// Lancer le chargement quand le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAccountPage);
} else {
  loadAccountPage();
}

console.log("📄 Script account.js chargé");