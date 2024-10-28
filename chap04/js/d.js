var xScaleFactor = 1;
var yScaleFactor = 1;

function scaleX(scale) {
  xScaleFactor = scale;
  updateScale();
}

function scaleY(scale) {
  yScaleFactor = scale;
  updateScale();
}

function updateScale() {
  var square = document.getElementById('square');
  square.style.transform = 'scaleX(' + xScaleFactor + ') scaleY(' + yScaleFactor + ')';
}