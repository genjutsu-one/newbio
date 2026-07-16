const widgetBase = 'https://raw.githubusercontent.com/genjutsu-one/bio/main/media/widget';
const widgetCount = 10;
const widgetInterval = 30 * 60 * 1000;

let currentCycle = -1;
let cycleOrder = [];

function shuffleCycle(cycle) {
  const arr = Array.from({ length: widgetCount }, (_, i) => i + 1);
  let seed = cycle;
  const rand = () => {
    seed = Math.sin(seed) * 10000;
    return seed - Math.floor(seed);
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function widgetUrlForSlot(slot) {
  const cycle = Math.floor(slot / widgetCount);
  const pos = slot % widgetCount;

  if (cycle !== currentCycle) {
    currentCycle = cycle;
    cycleOrder = shuffleCycle(cycle);
  }

  const n = cycleOrder[pos];
  return n === 1 ? widgetBase + '.mp4' : widgetBase + n + '.mp4';
}

export function initWidget() {
  const vid = document.getElementById('widget-vid');
  if (!vid) return;

  vid.addEventListener('loadedmetadata', () => {
    if (vid.videoWidth && vid.videoHeight) {
      vid.style.setProperty('--vid-ratio', vid.videoWidth + ' / ' + vid.videoHeight);
    }
  });

  function applyCurrentSlot() {
    const slot = Math.floor(Date.now() / widgetInterval);
    vid.src = widgetUrlForSlot(slot);
    vid.load();
    vid.play().catch(() => {});
  }

  function scheduleNext() {
    const delay = widgetInterval - (Date.now() % widgetInterval);
    setTimeout(() => {
      applyCurrentSlot();
      scheduleNext();
    }, delay);
  }

  applyCurrentSlot();
  scheduleNext();

  window.toggleWidgetMute = function() {
    vid.muted = !vid.muted;
    if (!vid.muted) {
      vid.play().catch(() => {});
    }
    document.querySelector('.widget-card .dot').classList.toggle('playing', !vid.muted);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) vid.play().catch(() => {});
      else vid.pause();
    });
  }, { threshold: 0.15 });
  observer.observe(vid);
}
