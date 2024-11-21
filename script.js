// Variables globales
let totalBoites; // Nombre total de boîtes
let boites = []; // Tableau des boîtes
let timer; // Timer
let timeLeft = 30; // Temps restant
let correctClicks = 0; // Nombre de clics corrects
let bestTime = localStorage.getItem('bestTime') || "-"; // Meilleur temps stocké localement
let gameStarted = false; // Indicateur si le jeu est en cours

// Initialisation du meilleur temps
document.getElementById("best-time").textContent = `Meilleur temps : ${bestTime}s`;

// Fonction pour demander au joueur combien de boîtes il veut
function demanderNombreBoites() {
    const nombre = prompt("Combien de boîtes voulez-vous dans le jeu ?", "9");
    totalBoites = parseInt(nombre, 10);
    totalBoites = totalBoites > 0 ? totalBoites : 9; // Valeur par défaut si l'entrée est invalide
}

// Fonction pour créer les boîtes
function createBoxes() {
    const board = document.getElementById("board");
    boites = [];
    board.innerHTML = ""; // Réinitialiser le plateau

    for (let i = 1; i <= totalBoites; i++) {
        const box = document.createElement("div");
        box.classList.add("box");
        box.textContent = i;
        box.addEventListener("click", handleBoxClick);
        boites.push(box);
    }

    shuffleBoites(); // Mélanger les boîtes
    boites.forEach(box => board.appendChild(box)); // Ajouter les boîtes au plateau
}

// Fonction pour mélanger les boîtes
function shuffleBoites() {
    for (let i = boites.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [boites[i], boites[j]] = [boites[j], boites[i]];
    }
}

// Gestion du clic sur une boîte
function handleBoxClick(event) {
    if (!gameStarted) return; // Empêcher les clics si le jeu n'a pas commencé

    const box = event.target;
    const expectedValue = correctClicks + 1;

    // Vérifier si le clic est correct
    if (parseInt(box.textContent, 10) === expectedValue) {
        box.classList.add("box-clicked");
        correctClicks++;

        // Remélanger les boîtes après chaque clic valide
        shuffleBoites();
        updateBoard();

        // Vérifier si toutes les boîtes ont été cliquées
        if (correctClicks === totalBoites) {
            endGame();
        }
    }
}

// Mettre à jour le plateau avec les boîtes mélangées
function updateBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    boites.forEach(box => board.appendChild(box));
}

// Fonction pour démarrer le jeu
function startGame() {
    if (gameStarted) return;

    demanderNombreBoites();
    gameStarted = true;
    correctClicks = 0;
    timeLeft = 30;

    createBoxes();
    startTimer();
}

// Fonction pour démarrer le timer
function startTimer() {
    const timerElement = document.getElementById("timer");
    timerElement.textContent = `Temps restant : ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Temps restant : ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Temps écoulé ! Vous avez perdu.");
            resetGame();
        }
    }, 1000);
}

// Fonction pour terminer le jeu
function endGame() {
    clearInterval(timer);
    gameStarted = false;

    const currentTime = 30 - timeLeft;

    if (bestTime === "-" || currentTime < bestTime) {
        bestTime = currentTime;
        localStorage.setItem("bestTime", bestTime);
        alert(`Nouveau meilleur temps : ${bestTime}s`);
    } else {
        alert(`Bravo ! Vous avez gagné en ${currentTime}s.`);
    }

    resetGame();
}

// Fonction pour réinitialiser le jeu
function resetGame() {
    gameStarted = false;
    correctClicks = 0;
    timeLeft = 30;
    document.getElementById("timer").textContent = "Temps restant : 30s";
    createBoxes();
}

// Écouteur sur le bouton Démarrer
document.getElementById("start-button").addEventListener("click", startGame);
