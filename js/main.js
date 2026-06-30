/* ─────────────────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrolled  = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = ((scrolled / maxScroll) * 100) + '%';
}, { passive: true });

/* ─────────────────────────────────────────
   PAGE LOADER
───────────────────────────────────────── */
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('hidden'), 1200);
});

/* ─────────────────────────────────────────
   CUSTOM CURSOR (desktop only)
───────────────────────────────────────── */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
const isTouch     = window.matchMedia('(hover: none)').matches;

if (!isTouch && cursor) {
  let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  (function animateTrail() {
    trailX += (mouseX - trailX) * 0.1;
    trailY += (mouseY - trailY) * 0.1;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  })();
}

/* ─────────────────────────────────────────
   HEADER SCROLL
───────────────────────────────────────── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─────────────────────────────────────────
   MOBILE NAV (full-screen overlay)
───────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('is-open');
  navToggle.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', open);
  // Prevent body scroll when menu is open
  document.body.style.overflow = open ? 'hidden' : '';
});

navMenu.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    document.body.style.overflow = '';
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
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ─────────────────────────────────────────
   COUNTER ANIMATION
───────────────────────────────────────── */
function animateCounter(el) {
  const target    = parseInt(el.dataset.target, 10);
  const duration  = 1600;
  const stepTime  = 16;
  const increment = target / (duration / stepTime);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, stepTime);
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
    const top = target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─────────────────────────────────────────
   3D CARD TILT (service & value cards)
───────────────────────────────────────── */
if (!isTouch) {
  document.querySelectorAll('.service-card, .value-card').forEach(card => {
    const intensity = 8;

    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const x       = e.clientX - rect.left;
      const y       = e.clientY - rect.top;
      const cx      = rect.width  / 2;
      const cy      = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -intensity;
      const rotateY = ((x - cx) / cx) *  intensity;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease';
      card.style.transform  = '';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.15s ease';
    });
  });
}

/* ─────────────────────────────────────────
   BUTTON RIPPLE ON CLICK
───────────────────────────────────────── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const rect   = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top  = (e.clientY - rect.top)  + 'px';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* ─────────────────────────────────────────
   PARALLAX: hero glow follows mouse
───────────────────────────────────────── */
const heroGlow = document.querySelector('.hero__glow');
if (heroGlow && !isTouch) {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    heroGlow.style.transform = `translate(${x}px, ${y}px)`;
  });
}

/* ─────────────────────────────────────────
   ACTIVE NAV LINK ON SCROLL
───────────────────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'is-active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ─────────────────────────────────────────
   CONTACT FORM
───────────────────────────────────────── */
const form     = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    feedback.textContent = '';
    feedback.className   = 'form-feedback';

    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#f87171';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (!valid) {
      feedback.textContent = 'Por favor complete todos los campos requeridos.';
      feedback.classList.add('error');
      return;
    }

    const btnSpan = form.querySelector('button[type="submit"] span');
    if (btnSpan) btnSpan.textContent = 'Enviando…';

    setTimeout(() => {
      feedback.textContent = '¡Mensaje enviado! Nos pondremos en contacto pronto.';
      feedback.classList.add('success');
      form.reset();
      if (btnSpan) btnSpan.textContent = 'Enviar mensaje';
    }, 1400);
  });

  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => { field.style.borderColor = ''; });
  });
}
