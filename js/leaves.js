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
    var COUNT = W < 700 ? 16 : 26;

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
        speed: 9 + Math.random() * 7,
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

    var COUNT = 16;
    var DIR = 1;

    function cardW() { return card.clientWidth || 300; }
    function cardH() { return card.clientHeight || 200; }

    function resetToPile(leaf, initial) {
      var W = cardW(), H = cardH();
      leaf.state = 'piled';
      leaf.stateT = 0;
      leaf.pileDelay = initial ? Math.random() * 6 : 1 + Math.random() * 3.5;
      leaf.jitterPhase = Math.random() * Math.PI * 2;
      leaf.x = W * 0.08 + Math.random() * W * 0.16;
      leaf.y = H - 6 - Math.random() * (leaf.size * 1.6);
      leaf.baseX = leaf.x;
      leaf.rot = Math.random() * 50 - 25;
      leaf.rotSpeed = 0;
      leaf.vx = 0;
      leaf.vy = 0;
    }

    function makeLeaf(initial) {
      var size = 11 + Math.random() * 13;
      var leaf = {
        el: makeLeafEl(container),
        size: size
      };
      leaf.el.style.width = size + 'px';
      leaf.el.style.height = size + 'px';
      leaf.el.style.opacity = (0.5 + Math.random() * 0.4).toFixed(2);
      resetToPile(leaf, initial);
      return leaf;
    }

    var leaves = [];
    for (var i = 0; i < COUNT; i++) leaves.push(makeLeaf(true));

    var lastTs = null;
    function frame(ts) {
      if (lastTs === null) lastTs = ts;
      var dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;
      var t = ts / 1000;
      var W = cardW(), H = cardH();

      for (var j = 0; j < leaves.length; j++) {
        var lf = leaves[j];
        lf.stateT += dt;

        if (lf.state === 'piled') {
          var jitter = Math.sin(t * 1.3 + lf.jitterPhase) * 1.1;
          var visX = lf.baseX + jitter;
          lf.el.style.transform = 'translate3d(' + visX.toFixed(1) + 'px,' + lf.y.toFixed(1) + 'px,0) rotate(' + lf.rot.toFixed(1) + 'deg)';

          if (lf.stateT > lf.pileDelay) {
            lf.state = 'blowing';
            lf.stateT = 0;
            lf.x = lf.baseX;
            lf.vx = (55 + Math.random() * 55) * DIR;
            lf.vy = -(14 + Math.random() * 20);
            lf.rotSpeed = (Math.random() < 0.5 ? -1 : 1) * (70 + Math.random() * 140);
          }
          continue;
        }

        lf.vx += 70 * DIR * dt;
        lf.vy += 24 * dt;
        lf.x += lf.vx * dt;
        lf.y += lf.vy * dt + Math.sin(t * 3 + lf.jitterPhase) * 5 * dt;
        lf.rot += lf.rotSpeed * dt;

        lf.el.style.transform = 'translate3d(' + lf.x.toFixed(1) + 'px,' + lf.y.toFixed(1) + 'px,0) rotate(' + lf.rot.toFixed(1) + 'deg)';

        if ((DIR > 0 && lf.x - lf.size > W) || (DIR < 0 && lf.x + lf.size < 0) || lf.y - lf.size > H) {
          resetToPile(lf, false);
        }
      }

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initBackgroundLeaves();
    initReviewsLeaves();
  });
})();
