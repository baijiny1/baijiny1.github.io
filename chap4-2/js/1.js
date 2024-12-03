let cube = document.getElementById('cube');
let xSlider = document.getElementById('x-slider');
let ySlider = document.getElementById('y-slider');
let rotationY = 0; // 用于跟踪旋转角度

function updateCubePosition() {
  cube.style.transform = `rotateY(${rotationY}deg) translateX(${xSlider.value}px) translateY(${ySlider.value}px)`;
}

// 监听滑块变化事件
xSlider.addEventListener('input', updateCubePosition);
ySlider.addEventListener('input', updateCubePosition);

// 设置立方体自动旋转
function animateCube() {
  rotationY += 1;
  if (rotationY > 360) rotationY = 0;
  updateCubePosition();
  requestAnimationFrame(animateCube);
}

// 开始动画
requestAnimationFrame(animateCube);