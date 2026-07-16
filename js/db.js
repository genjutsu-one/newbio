import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

let sb;

function setViewCounter(n) {
  const text = Number(n).toLocaleString();
  document.querySelectorAll('.view-counter').forEach(el => el.textContent = text);
}

async function trackView() {
  if (localStorage.getItem(VIEW_SEEN_KEY)) {
    try {
      const { data, error } = await sb.from('meta').select('value').eq('key', 'views').single();
      if (!error && data != null) {
        localStorage.setItem(VIEW_COUNT_KEY, String(data.value));
        setViewCounter(data.value);
      } else {
        const cached = localStorage.getItem(VIEW_COUNT_KEY);
        if (cached) setViewCounter(cached);
      }
    } catch(e) {
      const cached = localStorage.getItem(VIEW_COUNT_KEY);
      if (cached) setViewCounter(cached);
    }
    return;
  }

  try {
    const { data } = await sb.rpc('increment_views');
    localStorage.setItem(VIEW_SEEN_KEY, '1');
    if (data != null) localStorage.setItem(VIEW_COUNT_KEY, String(data));
    const n = data ?? '—';
    document.querySelectorAll('.view-counter').forEach(el => el.textContent = Number(n).toLocaleString());
  } catch(e) {
    document.querySelectorAll('.view-counter').forEach(el => el.textContent = '—');
  }
}

function sanitize(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function stars(n) {
  let s='';
  for(let i=1;i<=5;i++) s+='<svg class="star'+(i<=n?' star-on':'')+'" viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>';
  return s;
}

async function loadReviews() {
  const box = document.getElementById('reviews-list');
  try {
    const { data, error } = await sb.from('reviews').select('nick,text,rating,created_at').order('created_at',{ascending:false});
    
    let avg = '0.0';
    let cnt = 0;
    if (data && data.length) {
      cnt = data.length;
      const sum = data.reduce((a, r) => a + (r.rating || 0), 0);
      avg = (sum / cnt).toFixed(1);
    }
    
    document.querySelectorAll('.rating-counter').forEach(el => el.textContent = avg);
    document.querySelectorAll('.reviews-counter').forEach(el => el.textContent = cnt);

    if (error || !data?.length) { 
      box.innerHTML='<p class="review-empty">// no reviews yet. be first.</p>'; 
      return; 
    }
    
    box.innerHTML='';
    data.forEach(r => {
      const date = new Date(r.created_at).toLocaleDateString('en-GB');
      const el = document.createElement('div');
      el.className='review-card';
      el.innerHTML='<div class="review-header"><span class="review-author">'+sanitize(r.nick)+'</span><span class="review-meta"><span class="review-stars">'+stars(r.rating||0)+'</span><span class="review-date">'+date+'</span></span></div><div class="review-body">'+sanitize(r.text)+'</div>';
      box.appendChild(el);
    });
  } catch(e) {
    box.innerHTML='<p class="review-empty">// error loading</p>';
    document.querySelectorAll('.rating-counter').forEach(el => el.textContent = '0.0');
    document.querySelectorAll('.reviews-counter').forEach(el => el.textContent = '0');
  }
}

window._loadReviews = loadReviews;

export { trackView, loadReviews, sanitize };
export function setSb(client) {
  sb = client;
}
