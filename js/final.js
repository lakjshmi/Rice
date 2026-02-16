// Soft entrance animation
window.addEventListener("load", () => {
  document.querySelector(".container").style.opacity = "0";
  document.querySelector(".container").style.transform = "translateY(20px)";

  setTimeout(() => {
    document.querySelector(".container").style.transition =
      "opacity 1.2s ease, transform 1.2s ease";
    document.querySelector(".container").style.opacity = "1";
    document.querySelector(".container").style.transform = "translateY(0)";
  }, 100);
});

  const confettiContainer = document.querySelector('.confetti-container');

  const colors = [
    '#ff6f91',
    '#ffc75f',
    '#845ec2',
    '#4d96ff',
    '#00c9a7',
    '#f9f871'
  ];

  function createConfetti() {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');

    // Random shape
    confetti.classList.add(Math.random() > 0.5 ? 'square' : 'round');

    // Random size
    const size = Math.random() * 6 + 6;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size * 1.4}px`;

    // Random color
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    // Random horizontal start
    confetti.style.left = Math.random() * 100 + 'vw';

    // Random animation values
    confetti.style.setProperty('--drift', `${(Math.random() - 0.5) * 200}px`);
    confetti.style.setProperty('--spin', `${Math.random() * 720}deg`);

    const duration = Math.random() * 3 + 4;
    confetti.style.animationDuration = `${duration}s`;

    confettiContainer.appendChild(confetti);

    // Cleanup
    setTimeout(() => confetti.remove(), duration * 1000);
  }

  // Continuous confetti bursts
  setInterval(() => {
    for (let i = 0; i < 6; i++) {
      createConfetti();
    }
  }, 600);

