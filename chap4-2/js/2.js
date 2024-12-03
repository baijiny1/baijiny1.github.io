let cube = document.getElementById('cube');
let xScaleSlider = document.getElementById('x-scale-slider');
let yScaleSlider = document.getElementById('y-scale-slider');
let zScaleSlider = document.getElementById('z-scale-slider');
let rotationY = 0; // 用于跟踪旋转角度

function updateCubeTransform() {
  const scaleX = xScaleSlider.value;
  const scaleY = yScaleSlider.value;
  const scaleZ = zScaleSlider.value;
  cube.style.transform = `scale3d(${scaleX}, ${scaleY}, ${scaleZ}) rotateY(${rotationY}deg)`;
}

// 监听滑块变化事件
xScaleSlider.addEventListener('input', updateCubeTransform);
yScaleSlider.addEventListener('input', updateCubeTransform);
zScaleSlider.addEventListener('input', updateCubeTransform);

// 设置立方体自动旋转
function animateCube() {
  rotationY += 1;
  if (rotationY > 360) rotationY = 0;
  updateCubeTransform();
  requestAnimationFrame(animateCube);
}

// 初始化立方体变换
updateCubeTransform();

// 开始动画
requestAnimationFrame(animateCube);