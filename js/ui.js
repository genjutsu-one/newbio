import { loadReviews } from './db.js';

let selectedRating = 0;

function paintStars(n) {
  document.querySelectorAll('.star-input').forEach((x,i) => x.classList.toggle('star-on', i < n));
}

export function initUI() {
  const picker = document.querySelector('.star-picker');
  
  picker.addEventListener('mousemove', e => {
    const s = e.target.closest('.star-input');
    if (s) paintStars(+s.dataset.v);
  });
  
  picker.addEventListener('mouseleave', () => paintStars(selectedRating));
  
  picker.addEventListener('click', e => {
    const s = e.target.closest('.star-input');
    if (!s) return;
    selectedRating = +s.dataset.v;
    paintStars(selectedRating);
  });

  const reviewForm = document.getElementById('review-form');
  const sb = window._sbClient;
  
  reviewForm.addEventListener('submit', async e => {
    e.preventDefault();
    const nick = document.getElementById('input-nick').value.trim();
    const text = document.getElementById('input-text').value.trim();
    if (!nick || !text || !selectedRating) return;
    
    const btn = document.getElementById('btn-submit');
    btn.disabled = true;
    btn.textContent = '...';
    
    try {
      await sb.from('reviews').insert([{nick, text, rating: selectedRating}]);
      document.getElementById('input-nick').value = '';
      document.getElementById('input-text').value = '';
      selectedRating = 0;
      paintStars(0);
      await loadReviews();
    } catch(err) { 
      alert('error: '+err.message); 
    }
    
    btn.disabled = false;
    btn.textContent = 'send';
  });
}
