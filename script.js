// Fonction pour mélanger les enfants d'un conteneur (les boîtes dans notre jeu)
function shuffleChildren(parent) {
    // Convertit les enfants (les boîtes) du parent (le plateau de jeu) en un tableau.
    let children = Array.from(parent.children);
    
    // Mélange les éléments du tableau (les boîtes).
    for (let i = children.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Génère un nombre aléatoire entre 0 et i.
        parent.appendChild(children[j]); // Place l'enfant mélangé dans le conteneur.
    }
}

// Fonction pour gérer les réactions après avoir cliqué sur une boîte (succès, erreur, etc.)
function showReaction(type, clickedBox) {
    clickedBox.classList.add(type); // Ajoute la classe correspondant au type de réaction.
    
    // Si la réaction n'est pas un succès, on retire la classe après 800ms (pour enlever la couleur de réaction).
    if (type !== "success") {
        setTimeout(() => clickedBox.classList.remove(type), 800);
    }
}

// Variables globales pour stocker l'état du jeu
const board = document.querySelector("#board"); // Sélectionne le conteneur du plateau de jeu.
let nb = 1; // Compteur pour la boîte à cliquer (commence à 1).
let timerInterval; // Variable pour stocker l'intervalle du timer.
let timeLeft = 30; // Temps restant en secondes.
let gamePaused = false; // Variable pour savoir si le jeu est en pause.

// Fonction pour démarrer le jeu
function startGame() {
    // Cache le bouton "Démarrer" et affiche les boutons "Pause" et "Recommencer".
    document.querySelector("#start-button").classList.add("uk-hidden");
    document.querySelector("#pause-button").classList.remove("uk-hidden");
    document.querySelector("#restart-button").classList.add("uk-hidden");

    // Réinitialise l'interface du jeu.
    board.innerHTML = ""; // Vide le plateau.
    nb = 1; // Réinitialise le compteur.
    timeLeft = 30; // Réinitialise le temps restant.
    document.querySelector("#timer").innerText = "30s"; // Affiche le temps de départ.
    gamePaused = false; // Le jeu n'est pas en pause.

    // Création des boîtes à afficher sur le plateau
    for (let i = 1; i <= 10; i++) {
        const box = document.createElement("div"); // Crée une nouvelle boîte.
        box.classList.add("box"); // Ajoute une classe CSS pour le style.
        box.innerText = i; // Ajoute le numéro de la boîte.
        board.appendChild(box); // Ajoute la boîte au plateau.

        // Ajoute un événement au clic sur chaque boîte.
        box.addEventListener("click", () => {
            // Si la boîte cliquée correspond au numéro attendu (nb) et le jeu n'est pas en pause.
            if (i === nb && !gamePaused) {
                box.classList.add("box-clicked"); // Ajoute un style visuel à la boîte cliquée.
                showReaction("success", box); // Affiche une réaction de succès.
                // Si toutes les boîtes ont été cliquées dans le bon ordre, le jeu est gagné.
                if (nb === board.children.length) {
                    clearInterval(timerInterval); // Arrête le timer.
                    showNotification("Bravo, vous avez gagné !"); // Affiche un message de victoire.
                }
                nb++; // Augmente le numéro de la boîte à cliquer.
            } else if (i > nb) { // Si une boîte est cliquée trop tôt (avant le numéro attendu).
                showReaction("error", box); // Affiche une réaction d'erreur.
                resetGame("Vous avez cliqué sur la mauvaise boîte !"); // Réinitialise le jeu avec un message d'erreur.
            } else { // Si la boîte est déjà cliquée (n'est pas encore celle à cliquer).
                showReaction("notice", box); // Affiche une autre réaction (notifier).
            }
        });
    }

    shuffleChildren(board); // Mélange les boîtes sur le plateau.
    startTimer(); // Démarre le timer du jeu.
}

// Fonction pour démarrer le timer
function startTimer() {
    clearInterval(timerInterval); // Arrête tout timer en cours.
    timerInterval = setInterval(() => {
        // Si le jeu n'est pas en pause.
        if (!gamePaused) {
            timeLeft--; // Réduit le temps restant.
            document.querySelector("#timer").innerText = `${timeLeft}s`; // Met à jour l'affichage du timer.
            if (timeLeft === 0) { // Si le temps est écoulé, réinitialise le jeu.
                resetGame("Temps écoulé !");
            }
        }
    }, 1000); // Le timer est mis à jour chaque seconde.
}

// Fonction pour réinitialiser le jeu
function resetGame(message) {
    clearInterval(timerInterval); // Arrête le timer.
    showNotification(message); // Affiche un message d'alerte.
    board.innerHTML = ""; // Vide le plateau.
    nb = 1; // Réinitialise le compteur à 1.
    document.querySelector("#start-button").classList.remove("uk-hidden"); // Affiche le bouton "Démarrer".
    document.querySelector("#pause-button").classList.add("uk-hidden"); // Cache le bouton "Pause".
    document.querySelector("#restart-button").classList.remove("uk-hidden"); // Affiche le bouton "Recommencer".
}

// Fonction pour mettre le jeu en pause
function pauseGame() {
    gamePaused = true; // Le jeu est maintenant en pause.
    clearInterval(timerInterval); // Arrête le timer.
    showNotification("Jeu en pause"); // Affiche un message indiquant que le jeu est en pause.
    document.querySelector("#pause-button").innerText = "Reprendre"; // Change le texte du bouton "Pause" en "Reprendre".
}

// Fonction pour reprendre le jeu après une pause
function resumeGame() {
    gamePaused = false; // Le jeu reprend.
    startTimer(); // Relance le timer.
    document.querySelector("#pause-button").innerText = "Pause"; // Change le texte du bouton "Reprendre" en "Pause".
}

// Fonction pour afficher une notification (message)
function showNotification(message) {
    // Crée un élément de notification.
    const notification = document.createElement("div");
    notification.classList.add("uk-alert", "uk-alert-warning"); // Ajoute des classes CSS pour le style.
    notification.innerHTML = `
        <a href="#" class="uk-alert-close" uk-close></a>
        <p>${message}</p>
    `;
    document.querySelector("#notifications").appendChild(notification); // Ajoute la notification à l'interface.

    // Ferme la notification quand l'utilisateur clique sur le bouton de fermeture.
    notification.querySelector("a").addEventListener("click", () => {
        notification.remove();
    });
}

// Ajout des événements pour les boutons
document.querySelector("#start-button").addEventListener("click", startGame); // Démarre le jeu.
document.querySelector("#pause-button").addEventListener("click", () => {
    if (gamePaused) {
        resumeGame(); // Si le jeu est en pause, il reprend.
    } else {
        pauseGame(); // Si le jeu n'est pas en pause, il se met en pause.
    }
});
document.querySelector("#restart-button").addEventListener("click", startGame); // Recommence le jeu.
