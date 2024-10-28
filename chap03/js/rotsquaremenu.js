"use strict";

var canvas;
var gl;

var theta = 0.0;// 初始化旋转角度为0
var thetaLoc;
var direction = 1;
var delay = 200;// 控制旋转速度的延迟时间，单位为毫秒

function changeDir() {
	direction *= -1;
}

function initRotSquare() {
	canvas = document.getElementById("rot-canvas");
	gl = canvas.getContext("webgl2");
	if (!gl) {
		alert("WebGL isn't available");
	}

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	var program = initShaders(gl, "rot-v-shader", "rot-f-shader");// 初始化着色器程序
	gl.useProgram(program);

	var vertices = new Float32Array([ // 正方形的顶点坐标
		0, 1, 0,
		-1, 0, 0,
		1, 0, 0,
		0, -1, 0
	]);

	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);//3->每个顶点由三个坐标（x, y, z）组成
	gl.enableVertexAttribArray(vPosition);

	thetaLoc = gl.getUniformLocation(program, "theta");// 从着色器程序中获取一个uniform变量的位置

	document.getElementById("controls").onclick = function (event) {
		switch (event.target.index) {// 根据下拉菜单的选项执行不同的操作
			case 0:
				direction *= -1;
				break;
			case 1:
				delay /= 2.0;// 加快旋转速度
				break;
			case 2:
				delay *= 2.0;// 减慢旋转速度
				break;
		}
	};

	renderSquare();
}

function renderSquare() {
	gl.clear(gl.COLOR_BUFFER_BIT);

	// 设置uniform值
	theta += direction * 0.1;// 更新旋转角度
	if (theta > 2 * Math.PI) // 如果角度超过360度，减去360度
		theta -= (2 * Math.PI);
	else if (theta < -2 * Math.PI)// 如果角度低于-360度，加上360度
		theta += (2 * Math.PI);

	gl.uniform1f(thetaLoc, theta); // 将更新后的旋转角度传递给着色器


	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);//从索引为0的顶点开始，绘制4个顶点，使用 gl.TRIANGLE_STRIP 模式将它们连接成图形。

	// update and render
	setTimeout(function () { requestAnimFrame(renderSquare); }, delay);
	// setTimeout: 这是一个JavaScript函数，用于设置一个定时器，该定时器在指定的延迟后执行一个函数。
	//function() { requestAnimFrame(renderSquare); }: 这是传递给setTimeout的回调函数。当定时器触发时，这个函数会被执行。
	// requestAnimationFrame接收一个函数作为参数，这个函数将在浏览器下一次重绘之前被调用。在这个例子中，renderSquare函数将在下一次重绘之前被调用，以更新和渲染动画的下一帧。
	//delay: 这是传递给setTimeout的延迟时间（以毫秒为单位）。
}