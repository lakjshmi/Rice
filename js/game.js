let activeHole = null;
let timeoutId = null;
let gamePaused = false;

let totalChancesUsed = 0;
let currentStreak = 0;
let previousHole = null;

const MAX_CHANCES = 14;
const REQUIRED_STREAK = 6;

const holes = document.querySelectorAll(".hole");
const scoreEl = document.getElementById("score");
const scoreBox = document.querySelector(".score-box");
const overlay = document.getElementById("overlay");

const nextGameSlider = document.getElementById("nextGameSlider");
const nextGameLabel = document.getElementById("nextGameLabel");

const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const primaryBtn = document.getElementById("primaryBtn");
const pauseBtn = document.getElementById("pauseBtn");
const buttonSound = document.getElementById("buttonSound");
const bummerSound = new Audio("sounds/bummer.mp3");
bummerSound.volume = 0.7;


if (localStorage.getItem("auth") !== "true") {
  window.location.href = "index.html";
}




function playBummerSound() {
  bummerSound.currentTime = 0;
  bummerSound.play();
}
/* ---------------- MODAL ---------------- */

function showModal({ title, message, buttonText, onClick }) {
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  primaryBtn.textContent = buttonText;
  primaryBtn.onclick = onClick;
  overlay.classList.remove("hidden");
}

function hideModal() {
  overlay.classList.add("hidden");
}

/* ---------------- SOUND ---------------- */

function playButtonSound() {
  buttonSound.currentTime = 0;
  buttonSound.play();
}

/* ---------------- SCORE ANIMATION ---------------- */

function popScore() {
  scoreBox.classList.remove("pop");
  void scoreBox.offsetWidth;
  scoreBox.classList.add("pop");
}

/* ---------------- CORE ROUND CONTROL ---------------- */

function startRound() {
  if (gamePaused) return;

  if (totalChancesUsed >= MAX_CHANCES) {
    endGame();
    return;
  }

  totalChancesUsed++;
  holes.forEach((h) => (h.innerHTML = ""));

  let possibleHoles = [1, 2, 3, 4, 5];
  if (previousHole !== null) {
    possibleHoles = possibleHoles.filter((h) => h !== previousHole);
  }

  activeHole = possibleHoles[Math.floor(Math.random() * possibleHoles.length)];
  previousHole = activeHole;

  document.querySelector(`.hole[data-id="${activeHole}"]`).innerHTML =
    `<span class="ice-cream">🍦</span>`;

  clearTimeout(timeoutId);
  timeoutId = setTimeout(onTimeout, 2000);
}

function onTimeout() {
  if (gamePaused) return;

  currentStreak = 0;
  scoreEl.textContent = currentStreak;
  popScore();
  startRound();
}

/* ---------------- PLAYER INPUT ---------------- */

function hit(id) {
  if (gamePaused) return;

  playButtonSound();
  clearTimeout(timeoutId);

  if (id === activeHole) {
    currentStreak++;
    scoreEl.textContent = currentStreak;
    popScore();

    if (currentStreak === REQUIRED_STREAK) {
      winGame();
      return;
    }
  } else {
    currentStreak = 0;
    scoreEl.textContent = currentStreak;
    popScore();
  }

  startRound();
}

/* ---------------- GAME END STATES ---------------- */

function endGame() {
  gamePaused = true;
  clearTimeout(timeoutId);
gamePaused = true;
  clearTimeout(timeoutId);

  playBummerSound(); // 🔊 play loss sound

  showModal({
    title: "Ah bummer 😕",
    message: "You ran out of chances.",
    buttonText: "Retry",
    onClick: retry,
  });
}

function winGame() {
  gamePaused = true;
  clearTimeout(timeoutId);

  showModal({
    title: "You Win 🎉",
    message: "6 perfect hits in a row!",
    buttonText: "Continue",
    onClick: () => {
      hideModal();
      enableNextGameSlider();
    },
  });
}

/* ---------------- SLIDER ---------------- */

function enableNextGameSlider() {
  nextGameSlider.value = 0;
  nextGameSlider.classList.add("enabled");
  nextGameSlider.parentElement.style.display = "block";
}

function disableNextGameSlider() {
  nextGameSlider.value = 0;
  nextGameSlider.classList.remove("enabled");
  nextGameSlider.parentElement.style.display = "none";
}

/* ---------------- RETRY ---------------- */

function retry() {
  hideModal();
  clearTimeout(timeoutId);

  previousHole = null;
  totalChancesUsed = 0;
  currentStreak = 0;
  scoreEl.textContent = 0;
  popScore();

  disableNextGameSlider();
  gamePaused = false;
  startRound();
}

/* ---------------- PAUSE ---------------- */

function togglePause() {
  gamePaused = !gamePaused;

  if (gamePaused) {
    clearTimeout(timeoutId);
    pauseBtn.textContent = "▶ Resume";
  } else {
    pauseBtn.textContent = "⏸ Pause";
    startRound();
  }
}

pauseBtn.addEventListener("click", togglePause);

/* ---------------- KEYBOARD ---------------- */

document.addEventListener("keydown", (e) => {
  if (gamePaused) return;

  if (e.key >= "1" && e.key <= "5") {
    playButtonSound();
    hit(Number(e.key));
  }
});

/* ---------------- SLIDER NAV ---------------- */

nextGameSlider.addEventListener("input", () => {
  if (!nextGameSlider.classList.contains("enabled")) return;

  if (nextGameSlider.value >= 100) {
    nextGameSlider.value = 0;
    window.location.href = "page3.html";
  }
});



/* ---------------- START ---------------- */

startRound();
