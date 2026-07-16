import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { trackView, loadReviews, setSb } from './db.js';
import { initUI } from './ui.js';
import { initMusicPlayer } from './player.js';
import { initBackground } from './background.js';
import { bootSequence } from './boot.js';
import { init3DTilt } from './tilt.js';
import { initWidget } from './widget.js';
import { initTheme } from './theme.js';

const sbClient = createClient(SUPABASE_URL, SUPABASE_KEY);
window._sbClient = sbClient;
setSb(sbClient);

bootSequence();
initTheme();

document.addEventListener('DOMContentLoaded', () => {
  trackView();
  setTimeout(loadReviews, 300);
  
  initUI();
  initMusicPlayer();
  initBackground();
  init3DTilt();
  initWidget();

  let activeBox = null;

  function deactivateBox() {
    if (activeBox) {
      activeBox.classList.remove('is-active');
      activeBox.classList.remove('shine-run');
      activeBox = null;
    }
  }

  document.querySelectorAll('.stat-box').forEach(box => {
    box.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      if (activeBox && activeBox !== box) deactivateBox();

      if (activeBox === box) {
        deactivateBox();
        return;
      }

      activeBox = box;
      box.classList.add('is-active');
      box.classList.remove('shine-run');
      void box.offsetWidth;
      box.classList.add('shine-run');
    }, { passive: true });
  });

  document.addEventListener('touchstart', () => {
    deactivateBox();
  }, { passive: true });

  const pressTargets = '.card, .community-item, .link-item';

  document.addEventListener('pointerdown', (e) => {
    const el = e.target.closest(pressTargets);
    if (el) el.classList.add('pressed');
  });

  ['pointerup', 'pointercancel', 'pointerleave'].forEach(evt => {
    document.addEventListener(evt, () => {
      document.querySelectorAll('.pressed').forEach(el => el.classList.remove('pressed'));
    });
  });
});
