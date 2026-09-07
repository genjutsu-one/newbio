export function bootSequence() {
  const screen = document.getElementById('boot-screen');
  const label = document.getElementById('boot-label');
  const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  label.style.opacity = '1';

  if (REDUCE_MOTION) {
    finishBoot(screen);
    return;
  }

  const leafTypes = ['leaf-type-maple', 'leaf-type-oak'];
  const FILL_MS = 900;
  const MIN_CROSS_MS = 1500;
  const MAX_CROSS_MS = 2500;
  const FADE_TIMEOUT_MS = FILL_MS + MAX_CROSS_MS + 200;
  const leafCount = window.innerWidth < 600 ? 70 : 130;
  const W = window.innerWidth;
  const H = window.innerHeight;

  const container = document.createElement('div');
  container.className = 'boot-leaves';
  screen.insertBefore(container, screen.firstChild);

  const leaves = Array.from({ length: leafCount }, () => {
    const size = 14 + Math.random() * 24;
    const crossMs = MIN_CROSS_MS + Math.random() * (MAX_CROSS_MS - MIN_CROSS_MS);
    const travel = H + size * 4;
    const el = document.createElement('i');
    el.className = 'boot-leaf ' + leafTypes[Math.random() < 0.5 ? 0 : 1];
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    container.appendChild(el);
    return {
      el,
      spawnAt: Math.random() * FILL_MS,
      x: Math.random() * W,
      size,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 2.2,
      fallSpeedPerMs: travel / crossMs,
      swayAmp: 20 + Math.random() * 40,
      swaySpeed: 0.6 + Math.random() * 0.8,
      swayPhase: Math.random() * Math.PI * 2,
      done: false,
    };
  });

  let start = null;
  let rafId;
  let doneCount = 0;

  function frame(ts) {
    if (start === null) start = ts;
    const t = ts - start;

    for (const leaf of leaves) {
      if (leaf.done) continue;
      if (t < leaf.spawnAt) continue;
      const age = t - leaf.spawnAt;

      const y = -leaf.size * 2 + leaf.fallSpeedPerMs * age;
      leaf.rot += leaf.rotSpeed * 0.016;
      const sway = Math.sin(age * 0.003 * leaf.swaySpeed + leaf.swayPhase) * leaf.swayAmp;
      const alpha = Math.min(1, age / 220);

      leaf.el.style.opacity = alpha;
      leaf.el.style.transform = `translate(${leaf.x + sway}px, ${y}px) rotate(${leaf.rot}rad)`;

      if (y - leaf.size * 2 > H) {
        leaf.done = true;
        doneCount++;
      }
    }

    if (doneCount < leaves.length && t < FADE_TIMEOUT_MS) {
      rafId = requestAnimationFrame(frame);
    } else {
      finishBoot(screen);
    }
  }

  rafId = requestAnimationFrame(frame);

  screen.addEventListener('click', () => {
    cancelAnimationFrame(rafId);
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
