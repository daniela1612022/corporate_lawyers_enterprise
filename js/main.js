/* ─────────────────────────────────────────
   LOADER
───────────────────────────────────────── */
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('hidden'), 1200);
});

/* ─────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────── */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.1;
  trailY += (mouseY - trailY) * 0.1;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

/* ─────────────────────────────────────────
   HEADER SCROLL
───────────────────────────────────────── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─────────────────────────────────────────
   MOBILE NAV
───────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('is-open');
  navToggle.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', open);
});

navMenu.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('is-open');
    navToggle.classList.remove('is-open');
  });
});

/* ─────────────────────────────────────────
   SCROLL REVEAL (Intersection Observer)
───────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ─────────────────────────────────────────
   COUNTER ANIMATION
───────────────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step     = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ─────────────────────────────────────────
   SMOOTH SCROLL FOR ANCHOR LINKS
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 76;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─────────────────────────────────────────
   PARALLAX: hero glow on mouse move
───────────────────────────────────────── */
const heroGlow = document.querySelector('.hero__glow');
if (heroGlow) {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    heroGlow.style.transform = `translate(${x}px, ${y}px)`;
  });
}

/* ─────────────────────────────────────────
   CONTACT FORM
───────────────────────────────────────── */
const form     = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    feedback.textContent = '';
    feedback.className = 'form-feedback';

    const required = form.querySelectorAll('[required]');
    let valid = true;

    required.forEach(field => {
      const group = field.closest('.form-group');
      if (!field.value.trim()) {
        field.style.borderColor = '#f87171';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (!valid) {
      feedback.textContent = 'Por favor completa todos los campos requeridos.';
      feedback.classList.add('error');
      return;
    }

    // Simulate async send — replace with real backend/EmailJS/Formspree
    const btn = form.querySelector('button[type="submit"] span');
    btn.textContent = 'Enviando…';

    setTimeout(() => {
      feedback.textContent = '¡Mensaje enviado! Te contactaremos pronto.';
      feedback.classList.add('success');
      form.reset();
      btn.textContent = 'Enviar mensaje';
    }, 1400);
  });

  // Live field validation reset
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => { field.style.borderColor = ''; });
  });
}
