/* ===== Helpers ===== */
const $ = (sel, all=false) => all ? document.querySelectorAll(sel) : document.querySelector(sel);

/* ===== Modal helper (used for booking & contact confirmations) ===== */
const showModal = (title, message) => {
  let modal = document.querySelector('.rs-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'rs-modal';
    modal.innerHTML = `
      <div class="rs-modal-backdrop" role="dialog" aria-modal="true">
        <div class="rs-modal-body">
          <button class="rs-modal-close" aria-label="Close modal">×</button>
          <h3 class="rs-modal-title"></h3>
          <p class="rs-modal-msg"></p>
        </div>
      </div>`;
    document.body.appendChild(modal);

    modal.querySelector('.rs-modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  }
  modal.querySelector('.rs-modal-title').textContent = title;
  modal.querySelector('.rs-modal-msg').textContent = message;
  // a11y: focus modal close button
  const closeBtn = modal.querySelector('.rs-modal-close');
  closeBtn.focus();
};

/* Smooth nav + mobile menu */
const navToggle = $('#navToggle');
const navMenu = $('#navMenu');
navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('show');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
$('#navMenu').addEventListener('click', (e) => {
  if (e.target.tagName === 'A') navMenu.classList.remove('show');
});

/* Close mobile nav when clicking outside */
document.addEventListener('click', (e) => {
  if (!navMenu.classList.contains('show')) return;
  if (e.target.closest('.nav')) return; // clicked inside nav
  navMenu.classList.remove('show');
  navToggle.setAttribute('aria-expanded', 'false');
});

/* Year in footer */
$('#year').textContent = new Date().getFullYear();

/* Theme toggle with persistence */
const themeToggle = $('#themeToggle');
const storedTheme = localStorage.getItem('rs-theme');
if (storedTheme) document.documentElement.setAttribute('data-theme', storedTheme);
const updateThemeIcon = () => {
  const mode = document.documentElement.getAttribute('data-theme') || 'light';
  themeToggle.textContent = mode === 'dark' ? '☀️' : '🌙';
};
updateThemeIcon();
themeToggle.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme') || 'light';
  const next = cur === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('rs-theme', next);
  updateThemeIcon();
});

/* Scroll to top button */
const toTop = $('#toTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 500) toTop.classList.add('show');
  else toTop.classList.remove('show');
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== Booking Form Validation & UX ===== */
const bookingForm = $('#bookingForm');
const checkinEl = $('#checkin');
const checkoutEl = $('#checkout');
const guestsEl = $('#guests');

const setMinDates = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth()+1).padStart(2,'0');
  const dd = String(today.getDate()).padStart(2,'0');
  const min = `${yyyy}-${mm}-${dd}`;
  checkinEl.min = min;
  checkoutEl.min = min;
};
setMinDates();

/* Update checkout.min when checkin changes (enforce at least 1 night) */
checkinEl.addEventListener('change', () => {
  if (!checkinEl.value) {
    checkoutEl.min = '';
    return;
  }
  const d = new Date(checkinEl.value);
  d.setDate(d.getDate() + 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  checkoutEl.min = `${yyyy}-${mm}-${dd}`;
  if (checkoutEl.value && (new Date(checkoutEl.value) <= new Date(checkoutEl.min))) {
    checkoutEl.value = '';
  }
});

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // clear errors
  $('#err-checkin').textContent = '';
  $('#err-checkout').textContent = '';
  $('#err-guests').textContent = '';

  const checkin = checkinEl.value ? new Date(checkinEl.value) : null;
  const checkout = checkoutEl.value ? new Date(checkoutEl.value) : null;
  const guests = parseInt(guestsEl.value, 10);

  let ok = true;
  if (!checkinEl.value){ $('#err-checkin').textContent = 'Please choose a check-in date.'; ok=false; }
  if (!checkoutEl.value){ $('#err-checkout').textContent = 'Please choose a check-out date.'; ok=false; }
  if (ok && checkout <= checkin){ $('#err-checkout').textContent = 'Check-out must be after check-in.'; ok=false; }
  if (!guests || guests < 1){ $('#err-guests').textContent = 'Guests must be at least 1.'; ok=false; }

  if (ok){
    // show modal instead of alert
    showModal('Booking Confirmed 🎉', `Your stay: ${checkinEl.value} → ${checkoutEl.value}\nGuests: ${guests}`);
    bookingForm.reset();
    setMinDates();
  }
});

/* ===== Contact Form Validation ===== */
const contactForm = $('#contactForm');
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  $('#err-cname').textContent = '';
  $('#err-cemail').textContent = '';
  $('#err-cmsg').textContent = '';

  const name = $('#cname').value.trim();
  const email = $('#cemail').value.trim();
  const msg = $('#cmsg').value.trim();

  let ok = true;
  if (!name) { $('#err-cname').textContent = 'Name is required.'; ok=false; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $('#err-cemail').textContent = 'Enter a valid email.'; ok=false; }
  if (!msg) { $('#err-cmsg').textContent = 'Message cannot be empty.'; ok=false; }

  if (ok){
    // sanitize & prepare payload
    const payload = {
      name: name.replace(/\s+/g,' '),
      email,
      message: msg
    };
    try {
      // Optional: post to your endpoint (Formspree, serverless function, etc.)
      // await fetch('https://formspree.io/f/YOUR_FORM_ID', { method: 'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) });

      showModal('Message Sent 📧', 'Thanks — we’ll get back to you shortly.');
      contactForm.reset();
    } catch (err) {
      showModal('Oops', 'There was an error sending your message. Please try again.');
    }
  }
});

/* ===== Testimonials Carousel ===== */
const track = $('#carouselTrack');
const slides = Array.from(track.children);
let index = 0;
const goTo = (i) => { index = (i + slides.length) % slides.length; track.style.transform = `translateX(-${index * 100}%)`; updateIndicators(); };
$('#prevSlide').addEventListener('click', () => goTo(index - 1));
$('#nextSlide').addEventListener('click', () => goTo(index + 1));

/* Indicators + pause/resume + keyboard */
const carousel = document.querySelector('.carousel');
let carouselTimer = null;
const indicatorsContainer = document.createElement('div');
indicatorsContainer.className = 'carousel-indicators';
slides.forEach((_, i) => {
  const btn = document.createElement('button');
  btn.setAttribute('aria-label', `Go to slide ${i+1}`);
  btn.addEventListener('click', () => { goTo(i); resetCarouselTimer(); });
  indicatorsContainer.appendChild(btn);
});
carousel.appendChild(indicatorsContainer);
const indicators = Array.from(indicatorsContainer.children);

const updateIndicators = () => {
  indicators.forEach((b, i) => b.classList.toggle('active', i === index));
};
updateIndicators();

const startCarousel = () => {
  carouselTimer = setInterval(() => goTo(index + 1), 3500);
};
const stopCarousel = () => clearInterval(carouselTimer);
const resetCarouselTimer = () => { stopCarousel(); startCarousel(); updateIndicators(); };

carousel.addEventListener('mouseenter', stopCarousel);
carousel.addEventListener('mouseleave', startCarousel);
carousel.addEventListener('focusin', stopCarousel);
carousel.addEventListener('focusout', startCarousel);

// keyboard support for carousel (left/right)
carousel.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') goTo(index - 1);
  if (e.key === 'ArrowRight') goTo(index + 1);
});

startCarousel();

/* ===== Scroll-spy: highlight active nav link ===== */
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

const onScrollSpy = () => {
  const offset = window.innerHeight * 0.35; // threshold
  let currentId = '';
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= offset && rect.bottom > offset) currentId = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
  });
};
window.addEventListener('scroll', onScrollSpy, { passive: true });
window.addEventListener('resize', onScrollSpy);
onScrollSpy(); // init

/* End of script */
