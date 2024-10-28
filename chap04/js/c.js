var xAngle = 0;
var yAngle = 0;

function rotateX(angle) {
  xAngle = angle;
  updateTransform();
}

function rotateY(angle) {
  yAngle = angle;
  updateTransform();
}

function updateTransform() {
  var square = document.getElementById('square');
  square.style.transform = 'rotateX(' + xAngle + 'deg) rotateY(' + yAngle + 'deg)';
}