// ─── Configuration ───────────────────────────────────────────────────────────
const API_BASE = 'http://localhost:8000/api';

// ─── Utility Functions ────────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const container = document.querySelector('.toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : '❌'}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function createToastContainer() {
  const c = document.createElement('div');
  c.className = 'toast-container';
  document.body.appendChild(c);
  return c;
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function initNav() {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 20);
  });

  hamburger?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('open');
    document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
  });

  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ─── Scroll Reveal ────────────────────────────────────────────────────────────
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ─── Counter Animation ────────────────────────────────────────────────────────
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 2000;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start) + suffix;
    if (start >= target) clearInterval(timer);
  }, 16);
}

function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseInt(e.target.dataset.target);
        const suffix = e.target.dataset.suffix || '';
        animateCounter(e.target, target, suffix);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('[data-counter]').forEach(el => observer.observe(el));
}

// ─── Workshop Modal ───────────────────────────────────────────────────────────
let currentWorkshopId = null;

function openRegisterModal(workshopId, workshopTitle) {
  currentWorkshopId = workshopId;
  const modal = document.getElementById('registerModal');
  const titleEl = document.getElementById('modalWorkshopTitle');
  if (titleEl) titleEl.textContent = workshopTitle;
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeRegisterModal() {
  const modal = document.getElementById('registerModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
  currentWorkshopId = null;
  // Reset form
  const form = document.getElementById('registerForm');
  const success = document.getElementById('registerSuccess');
  const alert = document.getElementById('registerAlert');
  if (form) form.style.display = 'block';
  if (success) success.style.display = 'none';
  if (alert) { alert.style.display = 'none'; alert.textContent = ''; }
  document.getElementById('regForm')?.reset();
}

// ─── Registration Form ────────────────────────────────────────────────────────
async function submitRegistration(e) {
  e.preventDefault();
  const btn = document.getElementById('regSubmitBtn');
  const alert = document.getElementById('registerAlert');

  if (!currentWorkshopId) return;

  const data = {
    workshop_id: currentWorkshopId,
    full_name: document.getElementById('regName').value,
    email: document.getElementById('regEmail').value,
    phone: document.getElementById('regPhone').value,
    age: parseInt(document.getElementById('regAge').value) || null,
    current_situation: document.getElementById('regSituation').value,
  };

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner" style="width:18px;height:18px;border-width:2px;"></span> Registering...';

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.detail || 'Registration failed');

    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('registerSuccess').style.display = 'block';
    showToast(`Registered successfully! See you there, ${data.full_name}! 🎉`);
    refreshWorkshops();
  } catch (err) {
    alert.textContent = err.message;
    alert.style.display = 'block';
    btn.disabled = false;
    btn.innerHTML = 'Confirm Registration →';
  }
}

// ─── Load Workshops ───────────────────────────────────────────────────────────
async function loadWorkshops() {
  const container = document.getElementById('workshopsContainer');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/workshops`);
    const workshops = await res.json();
    renderWorkshops(container, workshops);
  } catch {
    container.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:60px; color:var(--text-muted);">
        <div style="font-size:40px; margin-bottom:16px;">⚠️</div>
        <p>Could not connect to the server. Make sure the backend is running.</p>
        <code style="font-size:12px; opacity:0.6;">cd backend && uvicorn main:app --reload</code>
      </div>
    `;
  }
}

function renderWorkshops(container, workshops) {
  if (!workshops.length) {
    container.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:60px;">No workshops available yet.</div>';
    return;
  }

  container.innerHTML = workshops.map(w => {
    const pct = Math.round((w.seats_filled / w.seats_total) * 100);
    const available = w.seats_total - w.seats_filled;
    const isFull = available <= 0;
    const levelClass = w.skill_level === 'Beginner' ? 'level-beginner' : 'level-intermediate';

    return `
      <div class="workshop-card reveal" onclick="openRegisterModal(${w.id}, '${w.title.replace(/'/g, "\\'")}')">
        <div class="workshop-card-top">
          <span class="workshop-emoji">${w.icon}</span>
          <span class="workshop-level ${levelClass}">${w.skill_level}</span>
        </div>
        <h3>${w.title}</h3>
        <p>${w.description}</p>
        <div class="workshop-meta">
          <span><i>📅</i> ${w.date}</span>
          <span><i>🕙</i> ${w.time}</span>
          <span><i>📍</i> ${w.location}</span>
        </div>
        <div class="workshop-seats">
          <span>${available} seats left</span>
          <div class="seats-bar"><div class="seats-fill" style="width:${pct}%"></div></div>
          <span>${w.seats_total} total</span>
        </div>
        <button class="workshop-register-btn ${isFull ? 'workshop-full' : ''}" 
          onclick="event.stopPropagation(); ${isFull ? '' : `openRegisterModal(${w.id}, '${w.title.replace(/'/g, "\\'")}')`}">
          ${isFull ? '🔴 Workshop Full' : '→ Register for Free'}
        </button>
      </div>
    `;
  }).join('');

  initReveal();
}

async function refreshWorkshops() {
  await loadWorkshops();
}

// ─── Volunteer Form ───────────────────────────────────────────────────────────
async function submitVolunteer(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]');
  if (!email?.value) return;

  try {
    const res = await fetch(`${API_BASE}/volunteer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: email.value.split('@')[0], email: email.value }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.detail || 'Error');
    showToast('Thank you for volunteering! We\'ll be in touch. 🙌');
    email.value = '';
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
async function submitContact(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const data = {
    name: form.querySelector('#contactName')?.value,
    email: form.querySelector('#contactEmail')?.value,
    subject: form.querySelector('#contactSubject')?.value,
    message: form.querySelector('#contactMessage')?.value,
  };

  btn.disabled = true;
  btn.textContent = 'Sending...';

  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to send');
    showToast('Message sent! We\'ll reply within 24 hours. ✉️');
    form.reset();
  } catch (err) {
    showToast('Could not send message. Please try again.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send Message →';
  }
}

// ─── Load Live Stats ──────────────────────────────────────────────────────────
async function loadStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    const stats = await res.json();
    const el = document.getElementById('liveRegistrations');
    if (el) el.textContent = stats.total_registrations;
  } catch {}
}

// ─── Hero Progress Bars ───────────────────────────────────────────────────────
function animateProgressBars() {
  setTimeout(() => {
    document.querySelectorAll('.progress-fill[data-width]').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
  }, 800);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initCounters();
  animateProgressBars();
  loadWorkshops();
  loadStats();

  // Modal close
  document.getElementById('registerModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'registerModal') closeRegisterModal();
  });

  // Register form
  document.getElementById('regForm')?.addEventListener('submit', submitRegistration);

  // Volunteer form
  document.querySelector('.volunteer-form-inline')?.addEventListener('submit', submitVolunteer);

  // Contact form
  document.getElementById('contactForm')?.addEventListener('submit', submitContact);
});
