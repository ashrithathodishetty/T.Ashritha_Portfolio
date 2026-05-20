const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const scrollProgress = document.querySelector(".scroll-progress");

const navLinks = [...document.querySelectorAll(".nav-links a")];

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const revealItems = document.querySelectorAll(
  ".profile-card, .recruiter-card, .quick-strip article, .about-content, .value-grid article, .skill-card, .project-card, .timeline-item, .cert-grid article, .contact-card" +
    ", .resume-section"
);

const savedTheme = localStorage.getItem("portfolio-theme");

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
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
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
  item.style.setProperty("--reveal-delay", `${Math.min(index * 45, 300)}ms`);
  revealObserver.observe(item);
});

const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

  scrollProgress.style.setProperty(
    "--scroll-progress",
    `${Math.min(progress, 100)}%`
  );
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);

updateScrollProgress();

if (window.lucide) {
  window.lucide.createIcons();
}
