/* ===== Helpers ===== */
const $ = (sel, all=false) => all ? document.querySelectorAll(sel) : document.querySelector(sel);

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

/* Year in footer */
$('#year').textContent = new Date().getFullYear();

/* Theme toggle with persistence */
const themeToggle = $('#themeToggle');
const storedTheme = localStorage.getItem('rs-theme');
if (storedTheme) document.documentElement.setAttribute('data-theme', storedTheme);
const updateThemeIcon = () => {
  const mode = document.documentElement.getAttribute('data-theme');
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

/* ===== Booking Form Validation ===== */
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

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // clear errors
  $('#err-checkin').textContent = '';
  $('#err-checkout').textContent = '';
  $('#err-guests').textContent = '';

  const checkin = new Date(checkinEl.value);
  const checkout = new Date(checkoutEl.value);
  const guests = parseInt(guestsEl.value, 10);

  let ok = true;
  if (!checkinEl.value){ $('#err-checkin').textContent = 'Please choose a check-in date.'; ok=false; }
  if (!checkoutEl.value){ $('#err-checkout').textContent = 'Please choose a check-out date.'; ok=false; }
  if (ok && checkout <= checkin){ $('#err-checkout').textContent = 'Check-out must be after check-in.'; ok=false; }
  if (!guests || guests < 1){ $('#err-guests').textContent = 'Guests must be at least 1.'; ok=false; }

  if (ok){
    alert(`Booking confirmed 🎉\n${checkinEl.value} → ${checkoutEl.value}\nGuests: ${guests}`);
    bookingForm.reset();
    setMinDates();
  }
});

/* ===== Contact Form Validation ===== */
const contactForm = $('#contactForm');
contactForm.addEventListener('submit', (e) => {
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
    alert('Message sent! 📧 We’ll get back to you shortly.');
    contactForm.reset();
  }
});

/* ===== Testimonials Carousel ===== */
const track = $('#carouselTrack');
const slides = Array.from(track.children);
let index = 0;
const goTo = (i) => { index = (i + slides.length) % slides.length; track.style.transform = `translateX(-${index * 100}%)`; };
$('#prevSlide').addEventListener('click', () => goTo(index - 1));
$('#nextSlide').addEventListener('click', () => goTo(index + 1));
setInterval(() => goTo(index + 1), 3500);

/* ===== Gallery Lightbox ===== */
const lightbox = $('#lightbox');
const lightboxImg = $('#lightboxImg');
const lightboxCap = $('#lightboxCap');
const lightboxClose = $('#lightboxClose');

document.addEventListener('click', (e) => {
  const img = e.target.closest('.glight');
  if (!img) return;
  lightboxImg.src = img.src;
  lightboxCap.textContent = img.alt || '';
  if (typeof lightbox.showModal === 'function') lightbox.showModal();
  else lightbox.setAttribute('open', ''); // fallback
});
lightboxClose.addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.open) lightbox.close(); });