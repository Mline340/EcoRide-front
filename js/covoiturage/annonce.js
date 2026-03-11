(async function loadAccountPage() {
  // Récupération du token et userId
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
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
   
  // AFFICHAGE DES DONNÉES
  const userPrefElement = document.getElementById("preference-info");
if (userPrefElement) {
  // Créer un tableau avec toutes les lignes possibles
  const lignes = [
    { label: 'Passager', value: data.passager === true ? 'Oui' : data.passager },
    { label: 'Chauffeur', value: data.chauffeur === true ? 'Oui' : data.chauffeur },
    { label: 'Passager / Chauffeur', value: data.pas_chau === true ? 'Oui' : data.pas_chau },
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
try{
    const response = await fetch(`http://localhost:8000/api/voitures/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    const voitures = await response.json();
    const select = document.getElementById("select-voiture");

    // On remplit le SELECT
    select.innerHTML += voitures.map(v => 
        `<option value="${v.id}">${v.marque} ${v.modele} (${v.immatriculation})</option>`
    ).join("");
}catch (error) {
    console.error("❌ ERREUR:", error);}

})();