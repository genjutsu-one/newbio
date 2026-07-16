export function bootSequence() {
  const term = document.getElementById('boot-terminal');
  // alya cat
  const lines = [
    {cls:'', html:'<span class="boot-prompt">unnamed@dev</span><span class="boot-dim">:</span><span class="boot-hi">~</span><span class="boot-dim">$</span> <span class="boot-cmd">./start.sh</span>'},
    {cls:'boot-dim', html:'calculating sleep debt...'},
    {cls:'', html:'<span class="boot-warn">[  Warning  ]</span> <span class="boot-dim">sleep debt: CRITICAL</span>'},
    {cls:'', html:'<span class="boot-ok">[  OK  ]</span> <span class="boot-dim">loading good mood...</span>'},
    {cls:'', html:'<span class="boot-ok">[  OK  ]</span> <span class="boot-dim">coffee dependency resolved</span>'},
    {cls:'', html:'<span class="boot-ok">[  OK  ]</span> <span class="boot-dim">Arasaka firewall: bypassed</span>'},
    {cls:'boot-dim', html:'starting unnamed.dev...'},
    {cls:'', html:'<span class="boot-prompt">unnamed@dev</span><span class="boot-dim">:</span><span class="boot-hi">~</span><span class="boot-dim">$</span> <span class="boot-cursor"></span>'},
  ];

  let i = 0;
  function showNext() {
    if(i >= lines.length) {
      setTimeout(() => {
        document.getElementById('boot-screen').classList.add('fade-out');
        document.getElementById('site-wrapper').classList.add('visible');
        setTimeout(startScrollReveal, 80);
        setTimeout(() => { document.getElementById('boot-screen').style.display='none'; }, 700);
      }, 400);
      return;
    }
    const div = document.createElement('div');
    div.className = 'boot-line show' + (lines[i].cls ? ' '+lines[i].cls : '');
    div.innerHTML = lines[i].html;
    term.appendChild(div);
    i++;
    setTimeout(showNext, i === 1 ? 180 : 120);
  }
  setTimeout(showNext, 300);
}

function startScrollReveal() {
  const items = document.querySelectorAll('.main-wrap > *, .cards-grid > *');
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
