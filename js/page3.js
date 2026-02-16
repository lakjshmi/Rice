/* ---------------- AUTH ---------------- */
if (localStorage.getItem("auth") !== "true") {
  window.location.href = "game.html";
}

/* ---------------- ELEMENTS ---------------- */
const tilesEl = [...document.querySelectorAll(".tile")];
const leverBtn = document.getElementById("lever");

/* ---------------- TILE MAP ---------------- */
const tileMap = {};
tilesEl.forEach((t) => {
  const cls = [...t.classList].find((c) => /^r\d+c\d+$/.test(c));
  if (cls) tileMap[cls] = t;
});

/* ---------------- STATE ---------------- */
const startTile = tilesEl.find((t) => t.classList.contains("start"));
const endTile = tilesEl.find((t) => t.classList.contains("end"));

let emojiPos = startTile;
let cursor = startTile;

/* ---------------- SOUND ---------------- */
let suppressSwitchSound = false;

const switchSound = new Audio("sounds/switch.mp3");
switchSound.volume = 0.3;

function playSwitchSound() {
  switchSound.currentTime = 0;
  switchSound.play();
}
const resetSound = new Audio("sounds/reset.mp3");
resetSound.volume = 0.7;

function playResetSound() {
  resetSound.currentTime = 0;
  resetSound.play();
}

/* ON/OFF state (start is NEVER on) */
const tiles = new Map();
tilesEl.forEach((t) => tiles.set(t, false));

/* ---------------- UTILS ---------------- */
function countOnTiles() {
  let count = 0;
  tiles.forEach((v, t) => {
    if (v && !t.classList.contains("start")) count++;
  });
  return count;
}

tilesEl.forEach(tile => {
  tile.addEventListener("click", () => {
    cursor = tile;
    render();
  });
});


function getNeighbors(tile) {
  const cls = [...tile.classList].find((c) => /^r\d+c\d+$/.test(c));
  const [r, c] = cls.match(/\d+/g).map(Number);

  return [
    tileMap[`r${r - 1}c${c}`],
    tileMap[`r${r + 1}c${c}`],
    tileMap[`r${r}c${c - 1}`],
    tileMap[`r${r}c${c + 1}`],
  ].filter(Boolean);
}

function resetGame() {
  tiles.forEach((_, t) => tiles.set(t, false));
  emojiPos = startTile;
  cursor = startTile;
  render();
}

/* ---------------- RENDER ---------------- */
function render() {
  tilesEl.forEach((t) => {
    t.classList.remove("active", "selected");

    if (tiles.get(t) && !t.classList.contains("start")) {
      t.classList.add("active");
    }

    if (t === cursor) t.classList.add("selected");

    t.innerHTML = "";

    if (t === emojiPos) {
      t.innerHTML = `<span class="emoji">🐥</span>`;
    } else if (t === startTile) {
      t.innerHTML = `<span class="emojis">🌴</span>`;
    } else if (t === endTile) {
      t.innerHTML = `<span class="emojis">🛖</span>`;
    } else t.textContent = "";
  });

  leverBtn.classList.toggle("on", tiles.get(cursor));
}

/* ---------------- LEVER ---------------- */
function toggleLever(fromUser = false) {
  if (!cursor || cursor === startTile) return;

  /* ================= TURN OFF ================= */
  if (tiles.get(cursor)) {
    tiles.set(cursor, false);

    // 🐥 Bird was standing here → RESET (priority sound)
    if (emojiPos === cursor) {
      playResetSound(); // 🔊 only reset sound
      resetGame();
      return;
    }

    render();
    return;
  }

  /* ================= TURN ON ================= */
  if (countOnTiles() >= 2) return;

  // ✅ Light ACTUALLY turns ON here
  tiles.set(cursor, true);

  // 🔊 Play switch sound ONLY for successful user action
  if (fromUser) {
    playSwitchSound();
  }

  tryMoveBird();
}

/* ---------------- MOVE LOGIC ---------------- */
function tryMoveBird() {
  const neighbors = getNeighbors(emojiPos);

  for (const tile of neighbors) {
    if (tiles.get(tile)) {
      emojiPos = tile;
      cursor = tile;

      if (tile === endTile) {
        winGame();
        return;
      }

      render();
      return;
    }
  }
}

/* ---------------- KEYBOARD NAV ---------------- */
document.addEventListener("keydown", (e) => {
  /* SPACE BAR → TOGGLE LEVER */
  if (e.code === "Space") {
    e.preventDefault();
    toggleLever(true);
    return;
  }

  const cls = [...cursor.classList].find((c) => /^r\d+c\d+$/.test(c));
  if (!cls) return;

  const [r, c] = cls.match(/\d+/g).map(Number);

  let target = cursor;

  if (e.key === "ArrowUp") target = tileMap[`r${r - 1}c${c}`] || cursor;
  if (e.key === "ArrowDown") target = tileMap[`r${r + 1}c${c}`] || cursor;
  if (e.key === "ArrowLeft") target = tileMap[`r${r}c${c - 1}`] || cursor;
  if (e.key === "ArrowRight") target = tileMap[`r${r}c${c + 1}`] || cursor;

  cursor = target;
  render();
});

/* ---------------- WIN ---------------- */
function winGame() {
  const overlay = document.getElementById("overlay");
  overlay.classList.remove("hidden");

  document.getElementById("modalTitle").textContent = "Victory 🎉";
  document.getElementById("modalMessage").textContent =
    "You helped Birdy reach home safely!";
}
function hideModal() {
  document.getElementById("overlay").classList.add("hidden");

  // Victory OK → go to final page
  if (document.getElementById("modalTitle").textContent.includes("Victory")) {
    window.location.href = "final.html";
  }
}


/* ---------------- INIT ---------------- */
leverBtn.addEventListener("click", () => toggleLever(true));

render();
