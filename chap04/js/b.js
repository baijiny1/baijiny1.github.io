// 获取正方形元素和控制参数
var square = document.getElementById('square');
var dxInput = document.getElementById('x');
var dyInput = document.getElementById('y');

function moveSquare() {
  // 获取平移参数
  var dx = parseInt(dxInput.value);
  var dy = parseInt(dyInput.value);

  // 获取正方形当前位置
  var xPos = parseInt(square.style.left);
  var yPos = parseInt(square.style.top);

  // 更新正方形位置
  xPos += dx;
  yPos += dy;

  // 确保正方形不超出屏幕边界
  xPos = Math.max(0, Math.min(xPos, window.innerWidth - 100));
  yPos = Math.max(0, Math.min(yPos, window.innerHeight - 100));

  // 设置正方形新位置
  square.style.left = xPos + 'px';
  square.style.top = yPos + 'px';
}