(function () {
  'use strict';

  var REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LEAF_TYPES = ['leaf-type-maple', 'leaf-type-oak'];

  function randType() {
    return LEAF_TYPES[Math.random() < 0.5 ? 0 : 1];
  }

  function makeLeafEl(container) {
    var el = document.createElement('i');
    el.className = 'leaf ' + randType();
    container.appendChild(el);
    return el;
  }

  function initBackgroundLeaves() {
    var container = document.createElement('div');
    container.className = 'leaves-bg';
    document.body.insertBefore(container, document.body.firstChild);

    if (REDUCE_MOTION) return;

    var W = window.innerWidth;
    var H = window.innerHeight;
    var COUNT = W < 700 ? 24 : 38;

    var REPEL_RADIUS = 140;
    var REPEL_STRENGTH = 620;
    var REPEL_DECAY = 5.5;

    var pointer = { x: -9999, y: -9999, active: false };

    function onPointerMove(e) {
      var p = e.touches ? e.touches[0] : e;
      if (!p) return;
      pointer.x = p.clientX;
      pointer.y = p.clientY;
      pointer.active = true;
    }
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseleave', function () { pointer.active = false; });
    window.addEventListener('resize', function () {
      W = window.innerWidth;
      H = window.innerHeight;
    });

    function makeLeaf() {
      var size = 18 + Math.random() * 26;
      var leaf = {
        el: makeLeafEl(container),
        x: Math.random() * W,
        y: -size - Math.random() * H,
        size: size,
        speed: 13 + Math.random() * 10,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 16,
        swayAmp: 10 + Math.random() * 16,
        swaySpeed: 0.22 + Math.random() * 0.3,
        swayPhase: Math.random() * Math.PI * 2,
        rx: 0,
        ry: 0
      };
      leaf.el.style.width = size + 'px';
      leaf.el.style.height = size + 'px';
      leaf.el.style.opacity = (0.45 + Math.random() * 0.45).toFixed(2);
      return leaf;
    }

    function recycle(leaf) {
      leaf.y = -leaf.size - Math.random() * 120;
      leaf.x = Math.random() * W;
      leaf.rx = 0;
      leaf.ry = 0;
    }

    var leaves = [];
    for (var i = 0; i < COUNT; i++) leaves.push(makeLeaf());

    var lastTs = null;
    function frame(ts) {
      if (lastTs === null) lastTs = ts;
      var dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;
      var t = ts / 1000;
      var decay = Math.exp(-REPEL_DECAY * dt);

      for (var j = 0; j < leaves.length; j++) {
        var lf = leaves[j];

        lf.y += lf.speed * dt;
        lf.rot += lf.rotSpeed * dt;

        var sway = Math.sin(t * lf.swaySpeed * Math.PI * 2 + lf.swayPhase) * lf.swayAmp;
        var baseX = lf.x + sway;
        var baseY = lf.y;

        if (pointer.active) {
          var dx = (baseX + lf.rx) - pointer.x;
          var dy = (baseY + lf.ry) - pointer.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPEL_RADIUS && dist > 0.001) {
            var force = (1 - dist / REPEL_RADIUS);
            lf.rx += (dx / dist) * force * REPEL_STRENGTH * dt;
            lf.ry += (dy / dist) * force * REPEL_STRENGTH * dt;
          }
        }
        lf.rx *= decay;
        lf.ry *= decay;

        var visX = baseX + lf.rx;
        var visY = baseY + lf.ry;
        lf.el.style.transform = 'translate3d(' + visX.toFixed(1) + 'px,' + visY.toFixed(1) + 'px,0) rotate(' + lf.rot.toFixed(1) + 'deg)';

        if (lf.y - lf.size > H + 40) recycle(lf);
      }

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function initReviewsLeaves() {
    var card = document.getElementById('reviews');
    if (!card) return;

    var container = document.createElement('div');
    container.className = 'reviews-leaves';
    card.insertBefore(container, card.firstChild);

    if (REDUCE_MOTION) return;

    var COUNT = 46;
    var triggered = false;

    function cardW() { return card.clientWidth || 300; }
    function cardH() { return card.clientHeight || 200; }

    function makeLeaf() {
      var size = 11 + Math.random() * 15;
      var W = cardW(), H = cardH();
      var leaf = {
        el: makeLeafEl(container),
        size: size,
        x: Math.random() * W,
        y: Math.random() * H,
        rot: Math.random() * 360,
        opacity: 0.45 + Math.random() * 0.45
      };
      leaf.el.style.width = size + 'px';
      leaf.el.style.height = size + 'px';
      leaf.el.style.opacity = leaf.opacity.toFixed(2);
      leaf.el.style.transform = 'translate3d(' + leaf.x.toFixed(1) + 'px,' + leaf.y.toFixed(1) + 'px,0) rotate(' + leaf.rot.toFixed(1) + 'deg)';
      return leaf;
    }

    var leaves = [];
    for (var i = 0; i < COUNT; i++) leaves.push(makeLeaf());

    function blowAway() {
      if (triggered) return;
      triggered = true;

      var DIR = Math.random() < 0.5 ? -1 : 1;
      for (var j = 0; j < leaves.length; j++) {
        var lf = leaves[j];
        lf.vx = (170 + Math.random() * 190) * DIR;
        lf.vy = -(90 + Math.random() * 140);
        lf.rotSpeed = (Math.random() < 0.5 ? -1 : 1) * (240 + Math.random() * 300);
        lf.delay = Math.random() * 0.1;
      }

      var lastTs = null;
      var elapsedTotal = 0;
      var DURATION = 0.9;

      function frame(ts) {
        if (lastTs === null) lastTs = ts;
        var dt = Math.min(0.05, (ts - lastTs) / 1000);
        lastTs = ts;
        elapsedTotal += dt;

        for (var j = 0; j < leaves.length; j++) {
          var lf = leaves[j];
          if (elapsedTotal < lf.delay) continue;

          lf.vy += 360 * dt;
          lf.x += lf.vx * dt;
          lf.y += lf.vy * dt;
          lf.rot += lf.rotSpeed * dt;
          lf.opacity = Math.max(0, lf.opacity - dt * 1.5);

          lf.el.style.opacity = lf.opacity.toFixed(2);
          lf.el.style.transform = 'translate3d(' + lf.x.toFixed(1) + 'px,' + lf.y.toFixed(1) + 'px,0) rotate(' + lf.rot.toFixed(1) + 'deg)';
        }

        if (elapsedTotal < DURATION) {
          requestAnimationFrame(frame);
        } else {
          container.remove();
        }
      }
      requestAnimationFrame(frame);
    }

    var SHOW_DELAY = 900;

    function scheduleBlow() {
      setTimeout(blowAway, SHOW_DELAY);
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            scheduleBlow();
            observer.disconnect();
          }
        });
      }, { threshold: 0.15 });
      observer.observe(card);
    } else {
      scheduleBlow();
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initBackgroundLeaves();
    initReviewsLeaves();
  });
})();
