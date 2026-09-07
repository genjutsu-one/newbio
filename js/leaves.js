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

document.addEventListener('DOMContentLoaded', function () {
  leavesAreFalling();
});
