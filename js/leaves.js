function leavesAreFalling() {
  var leafTypes = ['leaf-type-maple', 'leaf-type-oak'];
  function randLeafType() {
    return leafTypes[Math.floor(Math.random() * leafTypes.length)];
  }

  var COUNT = 30;
  var div = document.createElement('div');
  div.className = 'leaves';
  var html = '';
  for (var i = 0; i < COUNT; i++) {
    html += '<i class="leaf ' + randLeafType() + '"></i>';
  }
  div.innerHTML = html;
  document.body.insertBefore(div, document.body.childNodes[0]);
}

function leavesBoot() {
  var leafTypes = ['leaf-type-maple', 'leaf-type-oak'];
  function randLeafType() {
    return leafTypes[Math.floor(Math.random() * leafTypes.length)];
  }

  var bootScreen = document.getElementById('boot-screen');
  if (!bootScreen) return;

  var COUNT = 45;
  var div = document.createElement('div');
  div.className = 'boot-leaves';

  for (var i = 0; i < COUNT; i++) {
    var leaf = document.createElement('i');
    leaf.className = 'boot-leaf ' + randLeafType();
    var size = 14 + Math.random() * 24;
    var rot = 220 + Math.random() * 260;
    leaf.style.left = (Math.random() * 100) + '%';
    leaf.style.width = size + 'px';
    leaf.style.height = size + 'px';
    leaf.style.animationDelay = (Math.random() * 0.7) + 's';
    leaf.style.animationDuration = (1 + Math.random() * 1.2) + 's';
    leaf.style.setProperty('--boot-rot', rot + 'deg');
    div.appendChild(leaf);
  }

  bootScreen.insertBefore(div, bootScreen.firstChild);
}

document.addEventListener('DOMContentLoaded', function () {
  leavesAreFalling();
  leavesBoot();
});
