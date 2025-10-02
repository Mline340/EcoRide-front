import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html", []),
    new Route("/covoit", "Covoiturages", "/pages/covoiturage/covoit.html", []),
    new Route("/signin", "Connexion", "/pages/auth/signin.html", ["disconnected"], "/js/auth/signin.js"),
    new Route("/signup", "Inscription", "/pages/auth/signup.html", ["disconnected"], "/js/auth/signup.js"),
    new Route("/account", "Mon compte", "/pages/auth/account.html", []),
    new Route("/historique", "Historique trajets", "/pages/covoiturage/historique.html", ["utilisateur", "employe", "admin"],),
    new Route("/annonce", "Publier une annonce", "/pages/covoiturage/annonce.html", ["utilisateur"]),
    new Route("/contact", "Nous contacter", "/pages/auth/contact.html", []),
    new Route("/mentions", "Mentions legales", "/pages/mentions.html", []),

];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";