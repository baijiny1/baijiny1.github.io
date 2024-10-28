function drawSquare() {
  var canvas = document.getElementById('myCanvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    var xPos = document.getElementById('x').value;
    var yPos = document.getElementById('y').value;
    var size = document.getElementById('size').value;

    // 绘制正方形
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除之前的绘图
    ctx.beginPath();
    ctx.rect(xPos, yPos, size, size);
    ctx.fillStyle = 'lightblue';
    ctx.fill();
    ctx.stroke();
  }
}