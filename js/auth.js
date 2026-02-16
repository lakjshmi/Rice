const FIXED_USER = "laku";
const FIXED_PASS_HASH = "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4";

async function hashPassword(password) {
  const enc = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}


async function login() {
  const u = username.value.trim();
  const p = password.value;

  if (!u || !p) {
    shakeCard();
    return;
  }

  const hashedInput = await hashPassword(p);

  if (u === FIXED_USER && hashedInput === FIXED_PASS_HASH) {
    localStorage.setItem("auth", "true");

    document
      .getElementById("successPopup")
      .classList.remove("hidden");
  } else {
    shakeCard();
  }
}


function slideCheck(slider) {
  if (slider.value >= 100) {
    window.location.href = "game.html";
  }
}

function shakeCard() {
  const card = document.querySelector(".card");
  card.style.animation = "shake 0.3s";
  setTimeout(() => card.style.animation = "", 300);
}
