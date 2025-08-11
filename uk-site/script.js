// Helpers
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile nav
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle && navMenu) {
  const update = () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.setAttribute('aria-hidden', String(expanded));
  };
  navToggle.addEventListener('click', update);
  // Initialise hidden on small screens
  navMenu.setAttribute('aria-hidden', 'true');
}

// Year in footer
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

// Reveal on scroll
if (!prefersReducedMotion) {
  const revealables = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealables.forEach((el) => io.observe(el));
} else {
  document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
}

// Count up stats when visible
function animateCounter(element) {
  const target = Number(element.getAttribute('data-count-to')) || 0;
  const duration = 1200;
  const start = prefersReducedMotion ? target : 0;
  const startTime = performance.now();
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  function frame(now) {
    const progress = Math.min(1, (now - startTime) / duration);
    const value = Math.floor(start + (target - start) * easeOutCubic(progress));
    element.textContent = String(value);
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const statNumbers = document.querySelectorAll('.stat__num');
if (statNumbers.length) {
  if (prefersReducedMotion) {
    statNumbers.forEach((el) => (el.textContent = el.getAttribute('data-count-to') || '0'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statNumbers.forEach((el) => io.observe(el));
  }
}