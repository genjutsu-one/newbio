export function initBackground() {

  const canvas = document.getElementById('bg-canvas');

  const ctx = canvas.getContext('2d');

  let W, H;



  const mouse = {x: 0, y: 0, active: false};



  function resizeCanvas(){

    W = canvas.width = window.innerWidth;

    H = canvas.height = window.innerHeight;

  }

  resizeCanvas();

  window.addEventListener('resize', resizeCanvas);



  window.addEventListener('mousemove', e => {

    mouse.x = e.clientX;

    mouse.y = e.clientY;

    mouse.active = true;

  });

  window.addEventListener('mouseleave', () => { mouse.active = false; });



  const nodes = Array.from({length: NODE_COUNT}, () => {

    const vx = (Math.random() - .5) * SPEED;

    const vy = (Math.random() - .5) * SPEED;

    return {

      x: Math.random() * window.innerWidth,

      y: Math.random() * window.innerHeight,

      vx, vy, baseVx: vx, baseVy: vy

    };

  });



  function drawBg(){

    ctx.clearRect(0, 0, W, H);

    

    // rip unnamed. I spent a couple hours on edge bouncing and speed normalization cuz particles kept glitching out

    for(let i = 0; i < NODE_COUNT; i++){

      for(let j = i+1; j < NODE_COUNT; j++){

        const dx = nodes[i].x - nodes[j].x;

        const dy = nodes[i].y - nodes[j].y;

        const d = Math.sqrt(dx*dx + dy*dy);

        if(d < LINK_DIST){

          ctx.beginPath();

          ctx.moveTo(nodes[i].x, nodes[i].y);

          ctx.lineTo(nodes[j].x, nodes[j].y);

          ctx.strokeStyle = 'rgba(255,255,255,' + ((1 - d/LINK_DIST)*LINE_ALPHA) + ')';

          ctx.lineWidth = .9;

          ctx.stroke();

        }

      }

    }

    

    for(const n of nodes){

      if(mouse.active){

        const dx = n.x - mouse.x;

        const dy = n.y - mouse.y;

        const d = Math.sqrt(dx*dx + dy*dy) || 1;

        if(d < SCARE_RADIUS){

          const push = (1 - d/SCARE_RADIUS) * SCARE_FORCE;

          n.vx += (dx/d) * push;

          n.vy += (dy/d) * push;

        }

      }

      

      n.vx += (n.baseVx - n.vx) * 0.01;

      n.vy += (n.baseVy - n.vy) * 0.01;

      n.vx *= 0.998;

      n.vy *= 0.998;

      

      const sp = Math.sqrt(n.vx*n.vx + n.vy*n.vy);

      if(sp > MAX_SPEED){

        n.vx = n.vx/sp * MAX_SPEED;

        n.vy = n.vy/sp * MAX_SPEED;

      }

      

      n.x += n.vx;

      n.y += n.vy;

      

      if(n.x < 0){ n.x = 0; n.vx = Math.abs(n.vx); n.baseVx = Math.abs(n.baseVx); }

      if(n.x > W){ n.x = W; n.vx = -Math.abs(n.vx); n.baseVx = -Math.abs(n.baseVx); }

      if(n.y < 0){ n.y = 0; n.vy = Math.abs(n.vy); n.baseVy = Math.abs(n.baseVy); }

      if(n.y > H){ n.y = H; n.vy = -Math.abs(n.vy); n.baseVy = -Math.abs(n.baseVy); }

      

      ctx.beginPath();

      ctx.arc(n.x, n.y, 2, 0, Math.PI*2);

      ctx.fillStyle = 'rgba(255,255,255,' + DOT_ALPHA + ')';

      ctx.fill();

    }

    

    requestAnimationFrame(drawBg);

  }

  

  drawBg();

}
