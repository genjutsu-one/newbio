function leavesAreFalling() {
  var leafTypes = ['leaf-type-maple', 'leaf-type-oak'];
  function randLeafType() {
    return leafTypes[Math.floor(Math.random() * leafTypes.length)];
  }

  var div = document.createElement('div');
  div.className = 'leaves';
  div.innerHTML = `
    <i class="leaf ${randLeafType()}"></i>
    <i class="leaf ${randLeafType()}"></i>
    <i class="leaf-600px ${randLeafType()}"></i>
    <i class="leaf-768px ${randLeafType()}"></i>
    <i class="leaf-1024px ${randLeafType()}"></i>
    <i class="leaf-1280px ${randLeafType()}"></i>
    <i class="leaf-1366px ${randLeafType()}"></i>
    <i class="leaf-1600px ${randLeafType()}"></i>
    <i class="leaf-1800px ${randLeafType()}"></i>
    <i class="leaf-1920px ${randLeafType()}"></i>`;
  document.body.insertBefore(div, document.body.childNodes[0]);
}

document.addEventListener('DOMContentLoaded', leavesAreFalling);
