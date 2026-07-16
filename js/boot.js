
export function bootSequence() {
  const splash = document.getElementById('splash-screen');
  const site = document.getElementById('site-wrapper');

  const revealSite = () => {
    if (!splash || splash.classList.contains('splash-closing')) return;
    splash.classList.add('splash-closing');
    setTimeout(() => {
      splash.style.display = 'none';
      site.classList.add('visible');
      startScrollReveal();
    }, 900);
  };

  if (splash) {
    splash.addEventListener('click', revealSite, { once: true, passive: true });
    setTimeout(() => splash.classList.remove('splash-open'), 20);
    setTimeout(revealSite, 5500);
  } else {
    site.classList.add('visible');
    setTimeout(startScrollReveal, 80);
  }
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
