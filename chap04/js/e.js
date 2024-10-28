var triangle = document.getElementById('Triangle');

triangle.style.left = '50px';
triangle.style.top = '50px';

var directionX = 1;
var directionY = 1;

function animate() {
  var left = parseInt(triangle.style.left);
  var top = parseInt(triangle.style.top);

  left += directionX * 2;
  top += directionY * 2;

  if (left < 0 || left > window.innerWidth - 50) {
    directionX *= -1;
  }
  if (top < 0 || top > window.innerHeight - 100) {
    directionY *= -1;
  }

  triangle.style.left = left + 'px';
  triangle.style.top = top + 'px';

  requestAnimationFrame(animate);
}

animate();