const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const scrollProgress = document.querySelector(".scroll-progress");
const introLoader = document.querySelector(".intro-loader");
const introCanvas = document.querySelector(".intro-canvas");
const startJourney = document.querySelector(".start-journey");
const typingTarget = document.querySelector("[data-typing-text]");
const cursorGlow = document.querySelector(".cursor-glow");
const cursorDot = document.querySelector(".cursor-dot");
const cursorTrail = document.querySelector(".cursor-trail");
const commandTrigger = document.querySelector(".command-trigger");
const commandPalette = document.querySelector(".command-palette");
const commandClose = document.querySelector(".command-close");
const commandLinks = document.querySelectorAll(".command-list a");
const tiltCards = document.querySelectorAll(".project-card, .profile-card, .skill-card, .cert-grid article, .studio-strip article");
const spotlightCards = document.querySelectorAll(".profile-card, .skill-card, .project-card, .cert-grid article, .studio-strip article, .contact-card, .resume-section");
const magneticItems = document.querySelectorAll(".btn, .social-row a, .nav-cta, .theme-toggle, .command-trigger, .project-links a, .command-list a");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const revealItems = document.querySelectorAll(
  ".profile-card, .recruiter-card, .quick-strip article, .about-content, .skill-card, .project-card, .timeline-item, .cert-grid article, .contact-card"
  + ", .resume-section"
);

const savedTheme = localStorage.getItem("portfolio-theme");
document.body.classList.add("is-loading");

if (savedTheme === "light") {
  document.body.classList.add("light-theme");
  themeIcon.setAttribute("data-lucide", "sun");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  const isLight = document.body.classList.contains("light-theme");
  themeIcon.setAttribute("data-lucide", isLight ? "sun" : "moon");
  localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px", threshold: 0.01 }
);

sections.forEach((section) => observer.observe(section));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item, index) => {
  item.classList.add("reveal-item");
  item.style.setProperty("--reveal-delay", `${Math.min(index * 70, 420)}ms`);
  revealObserver.observe(item);
});

const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  scrollProgress.style.setProperty("--scroll-progress", `${Math.min(progress, 100)}%`);
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

const ctx = introCanvas?.getContext("2d");
let introAnimationFrame;
let introTime = 0;
let cursorX = 0.5;
let cursorY = 0.5;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let glowX = mouseX;
let glowY = mouseY;
let lastTrailTime = 0;

const resizeIntroCanvas = () => {
  if (!introCanvas || !ctx) return;
  const scale = window.devicePixelRatio || 1;
  introCanvas.width = window.innerWidth * scale;
  introCanvas.height = window.innerHeight * scale;
  introCanvas.style.width = `${window.innerWidth}px`;
  introCanvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
};

const drawIntroScene = () => {
  if (!ctx || !introCanvas) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  introTime += 1;
  ctx.clearRect(0, 0, width, height);

  const centerX = width * (0.5 + (cursorX - 0.5) * 0.12);
  const centerY = height * (0.48 + (cursorY - 0.5) * 0.08);

  const bg = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) * 0.55);
  bg.addColorStop(0, "rgba(51, 213, 195, 0.15)");
  bg.addColorStop(0.45, "rgba(140, 124, 255, 0.07)");
  bg.addColorStop(1, "rgba(7, 11, 22, 0)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  for (let ring = 0; ring < 4; ring += 1) {
    const radius = 90 + ring * 58 + Math.sin(introTime / 35 + ring) * 8;
    ctx.strokeStyle = `rgba(51, 213, 195, ${0.16 - ring * 0.025})`;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([12 + ring * 3, 14]);
    ctx.lineDashOffset = introTime * (ring % 2 === 0 ? -0.8 : 0.8);
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius * 1.5, radius, introTime / 180 + ring, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  const labels = ["React", "Python", "Node", "RAG", "Azure", "SQL"];
  labels.forEach((label, index) => {
    const angle = introTime / 55 + index * ((Math.PI * 2) / labels.length);
    const orbit = 150 + (index % 2) * 55;
    const x = centerX + Math.cos(angle) * orbit * 1.15;
    const y = centerY + Math.sin(angle) * orbit * 0.72;

    ctx.fillStyle = "rgba(16, 24, 39, 0.78)";
    ctx.strokeStyle = index % 2 === 0 ? "rgba(51, 213, 195, 0.5)" : "rgba(248, 198, 91, 0.48)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x - 42, y - 18, 84, 36, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(243, 247, 251, 0.9)";
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y + 1);
  });

  ctx.fillStyle = "rgba(248, 198, 91, 0.92)";
  ctx.beginPath();
  ctx.arc(centerX, centerY, 7 + Math.sin(introTime / 18) * 2, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 24; i += 1) {
    const x = (i * 97 + introTime * (0.35 + i * 0.015)) % width;
    const y = (i * 61 + Math.sin(introTime / 30 + i) * 18 + cursorY * 20) % height;
    ctx.fillStyle = i % 3 === 0 ? "rgba(248, 198, 91, 0.5)" : "rgba(255, 255, 255, 0.22)";
    ctx.beginPath();
    ctx.arc(x, y, i % 3 === 0 ? 2.2 : 1.4, 0, Math.PI * 2);
    ctx.fill();
  }

  introAnimationFrame = requestAnimationFrame(drawIntroScene);
};

const startIntroScene = () => {
  resizeIntroCanvas();
  drawIntroScene();
};

const finishIntro = () => {
  if (!introLoader || introLoader.classList.contains("is-hidden")) return;
  introLoader.classList.add("is-hidden");
  document.body.classList.remove("is-loading");
  document.body.classList.add("page-ready");
  cancelAnimationFrame(introAnimationFrame);
  typeRoleLine();
};

const phrases = [
  "React Developer | Python Programmer | AI/RAG Explorer",
  "Frontend Developer | Full-Stack Learner | Problem Solver",
  "Clean UI Builder | API Integrator | Cloud Basics"
];

let phraseIndex = 0;
let letterIndex = 0;
let isDeleting = false;

const typeRoleLine = () => {
  if (!typingTarget) return;

  const phrase = phrases[phraseIndex];
  typingTarget.textContent = phrase.slice(0, letterIndex);

  if (!isDeleting && letterIndex < phrase.length) {
    letterIndex += 1;
  } else if (isDeleting && letterIndex > 0) {
    letterIndex -= 1;
  } else if (!isDeleting) {
    isDeleting = true;
    setTimeout(typeRoleLine, 1100);
    return;
  } else {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }

  setTimeout(typeRoleLine, isDeleting ? 32 : 58);
};

window.addEventListener("pointermove", (event) => {
  document.body.classList.add("cursor-active");
  mouseX = event.clientX;
  mouseY = event.clientY;

  cursorX = event.clientX / window.innerWidth;
  cursorY = event.clientY / window.innerHeight;

  if (Date.now() - lastTrailTime > 42 && cursorTrail) {
    lastTrailTime = Date.now();
    const particle = document.createElement("span");
    particle.style.setProperty("--trail-x", `${event.clientX}px`);
    particle.style.setProperty("--trail-y", `${event.clientY}px`);
    cursorTrail.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove());
  }
});

window.addEventListener("pointerleave", () => {
  document.body.classList.remove("cursor-active");
});

const animateCursor = () => {
  glowX += (mouseX - glowX) * 0.12;
  glowY += (mouseY - glowY) * 0.12;

  cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;

  requestAnimationFrame(animateCursor);
};

animateCursor();

tiltCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 7}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

spotlightCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--card-x", `${x}%`);
    card.style.setProperty("--card-y", `${y}%`);
  });
});

magneticItems.forEach((item) => {
  item.addEventListener("pointerenter", () => {
    document.body.classList.add("cursor-hover");
  });

  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
  });

  item.addEventListener("pointerleave", () => {
    document.body.classList.remove("cursor-hover");
    item.style.transform = "";
  });
});

const openCommandPalette = () => {
  commandPalette.classList.add("is-open");
  commandPalette.setAttribute("aria-hidden", "false");
};

const closeCommandPalette = () => {
  commandPalette.classList.remove("is-open");
  commandPalette.setAttribute("aria-hidden", "true");
};

commandTrigger?.addEventListener("click", openCommandPalette);
commandClose?.addEventListener("click", closeCommandPalette);
commandLinks.forEach((link) => link.addEventListener("click", closeCommandPalette));
commandPalette?.addEventListener("click", (event) => {
  if (event.target === commandPalette) {
    closeCommandPalette();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "/" && !commandPalette.classList.contains("is-open")) {
    event.preventDefault();
    openCommandPalette();
  }

  if (event.key === "Escape") {
    closeCommandPalette();
  }
});

window.addEventListener("load", () => {
  startIntroScene();
  setTimeout(finishIntro, 4200);
});

window.addEventListener("resize", resizeIntroCanvas);

startJourney?.addEventListener("click", finishIntro);

window.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    finishIntro();
  }
});

if (window.lucide) {
  window.lucide.createIcons();
}

