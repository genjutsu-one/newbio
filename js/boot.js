export function bootSequence() {
  const screen = document.getElementById('boot-screen');
  const label = document.getElementById('boot-label');
  const BOOT_MS = 900;

  label.style.opacity = '1';

  let done = false;
  const timer = setTimeout(() => {
    if (done) return;
    done = true;
    finishBoot(screen);
  }, BOOT_MS);

  screen.addEventListener('click', () => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    finishBoot(screen);
  }, { once: true });
}

function finishBoot(screen) {
  screen.classList.add('fade-out');
  document.getElementById('site-wrapper').classList.add('visible');
  setTimeout(startScrollReveal, 80);
  setTimeout(() => { screen.style.display = 'none'; }, 700);
}

function startScrollReveal() {
  const items = document.querySelectorAll('.main-wrap > *');
  const reveal = (el) => {
    el.classList.add('reveal-in');
  };

  if (!('IntersectionObserver' in window)) {
    items.forEach(reveal);
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      io.unobserve(entry.target);
    });
  }, {
    root: null,
    threshold: 0.18,
    rootMargin: '0px 0px -8% 0px'
  });

  items.forEach(el => io.observe(el));
}
