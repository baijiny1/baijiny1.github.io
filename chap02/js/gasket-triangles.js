"use strict";
const { vec3 } = glMatrix;
var canvas;
var gl;
var points = [];	// 存储顶点数据的数组
$(document).ready(function () {
	var numTimesToSubdivide = 3; // 初始化剖分层次
	// 初始化绘制
	initTriangles(numTimesToSubdivide);
	// 更新剖分层次并重新绘制
	function updateSubdivision(level) {
		console.log("Update subdivision to:", level); // 调试日志
		points = [];
		// 调用绘制函数
		initTriangles(level);
	}

	// 滑块值变化时的处理函数
	$('#subdivision-slider').on('input', function () {
		var value = $(this).val();
		$('#subdivision-value').text(value); // 更新显示的值
		updateSubdivision(parseInt(value)); // 更新剖分层次并重新绘制
	});


});

function initTriangles(level) {
	console.log("Initialize triangles with level:", level); // 调试日志
	canvas = document.getElementById("gl-canvas");

	gl = canvas.getContext("webgl2");
	if (!gl) {
		alert("WebGL isn't available");
	}

	// 配置WebGL
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	// 初始化着色器程序并将其应用于当前的WebGL上下文
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	// 初始化谢尔宾斯基三角形的数据
	// 首先，初始化三角形的三个顶点
	var vertices = [
		-1, -1, 0,
		0, 1, 0,
		1, -1, 0
	];

	// 创建三维向量并初始化
	// var u = vec3.create();
	// vec3.set( u, -1, -1, 0 );
	var u = vec3.fromValues(vertices[0], vertices[1], vertices[2]);//// 从vertices数组中提取顶点A的x、y、z坐标，并创建一个vec3类型的向量
	// var v = vec3.create();
	// vec3.set( v, 0, 1, 0 );
	var v = vec3.fromValues(vertices[3], vertices[4], vertices[5]);
	// var w = vec3.create();
	// vec3.set( w, 1, -1, 0 );
	var w = vec3.fromValues(vertices[6], vertices[7], vertices[8]);

	// 调用函数，递归细分三角形
	divideTriangle(u, v, w, level);

	// 将数据加载到GPU
	var vertexBuffer = gl.createBuffer(); // 创建缓冲区对象
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);// 绑定缓冲区
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);// 将顶点数据加载到缓冲区

	// 把带有数据的buffer赋值给vPosition
	var vPosition = gl.getAttribLocation(program, "vPosition");		// 获取vPosition
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);	//给vPosition赋值
	gl.enableVertexAttribArray(vPosition);

	renderTriangles();

};

// 将所有三角形的顶点的坐标添加到全局的 points 数组中。
function triangle(a, b, c) {
	//var k;
	points.push(a[0], a[1], a[2]);
	points.push(b[0], b[1], b[2]);
	points.push(c[0], c[1], c[2]);
	// for( k = 0; k < 3; k++ )
	// 	points.push( a[k] );
	// for( k = 0; k < 3; k++ )
	// 	points.push( b[k] );
	// for( k = 0; k < 3; k++ )
	// 	points.push( c[k] );
}

// 定义递归细分三角形的函数
function divideTriangle(a, b, c, count) {
	// 检查是否达到递归的深度
	if (count == 0) {
		triangle(a, b, c);
	} else {
		var ab = vec3.create(); // 创建一个新的vec3向量，被初始化为[0, 0, 0]
		//ab：存储结果的向量。
		//a：起始向量。
		//b：结束向量。
		//alpha：插值因子，范围从0到1。0表示结果完全等于a，1表示结果完全等于b，0.5表示结果为a和b的中点。
		vec3.lerp(ab, a, b, 0.5); // ab=a*alpha+b*(1-alpha)
		var bc = vec3.create();
		vec3.lerp(bc, c, b, 0.5);
		var ca = vec3.create();
		vec3.lerp(ca, c, a, 0.5);

		// 递归细分三个新的三角形，注意：参数的顺序不能变，必须以逆时针顺序
		divideTriangle(a, ab, ca, count - 1); //创建一个以a、ab和ca为顶点的新三角形，并递归地细分它。
		divideTriangle(b, bc, ab, count - 1);
		divideTriangle(c, ca, bc, count - 1);

		//divideTriangle( ab, bc, ca, count-1 );
	}
}

function renderTriangles() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);

	//gl.drawArrays( gl.LINES, 0, lineNumber );
}