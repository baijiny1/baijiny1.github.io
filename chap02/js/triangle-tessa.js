"use strict";

const { vec3 } = glMatrix;

var canvas;
var gl;

var points = [];
var radius = 1;// 初始化三角形顶点的半径
var twist = false;// 是否扭曲 
var theta = 0;// 初始化旋转角度

$(document).ready(function () {
	/** Parameters */
	var numTimesToSubdivide = 3;// 初始化递归细分的次数
	initTriangles(numTimesToSubdivide); // 初始化绘制
	// 更新剖分层次并重新绘制
	function updateSubdivision(level) {
		console.log("Update subdivision to:", level); // 调试日志
		console.log("Update theta to:", theta); // 调试日志
		points = [];
		// 调用绘制函数
		initTriangles(level);
	}
	// 滑块值变化时的处理函数
	$('#subdivision-slider').on('input', function () {
		var value = $(this).val();
		$('#subdivision-value').text(value); // 更新显示的值
		numTimesToSubdivide = parseInt(value);
		updateSubdivision(parseInt(value)); // 更新剖分层次并重新绘制
	});


	$("#theta-slider").on("input", function () {
		var value = $(this).val();
		$('#theta-value').text(value); // 更新显示的值
		theta = parseInt(value);
		updateSubdivision(numTimesToSubdivide); // 更新剖分层次并重新绘制
	});

	// 绑定复选框事件
	$("#twist-checkbox").on("change", function () {
		twist = $(this).is(":checked");
		console.log("Update twist to:", twist);
		updateSubdivision(numTimesToSubdivide);
	});
});


function initTriangles(level) {
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

	// 初始化谢尔宾斯基三角剖分的三个顶点
	// R=0.6, Theta = 90, 210, -30
	var vertices = [
		radius * Math.cos(90 * Math.PI / 180.0), radius * Math.sin(90 * Math.PI / 180.0), 0,
		radius * Math.cos(210 * Math.PI / 180.0), radius * Math.sin(210 * Math.PI / 180.0), 0,
		radius * Math.cos(-30 * Math.PI / 180.0), radius * Math.sin(-30 * Math.PI / 180.0), 0
	];

	// 使用vec3创建顶点向量

	// var u = vec3.create();
	// vec3.set( u, -1, -1, 0 );
	var u = vec3.fromValues(vertices[0], vertices[1], vertices[2]);
	// var v = vec3.create();
	// vec3.set( v, 0, 1, 0 );
	var v = vec3.fromValues(vertices[3], vertices[4], vertices[5]);
	// var w = vec3.create();
	// vec3.set( w, 1, -1, 0 );
	var w = vec3.fromValues(vertices[6], vertices[7], vertices[8]);

	// 开始递归细分三角形
	divideTriangle(u, v, w, level);


	// 将数据加载到GPU
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

	// 把带有数据的buffer赋值给vPosition
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	renderTriangles();
};

//将三角形顶点添加到points数组中，并进行旋转
function tessellaTriangle(a, b, c) {
	//var k;
	var zerovec3 = vec3.create();
	vec3.zero(zerovec3);// 创建一个零向量
	var radian = theta * Math.PI / 180.0;// 将旋转角度转换为弧度

	var a_new = vec3.create();
	var b_new = vec3.create();
	var c_new = vec3.create();


	if (twist == false) {
		// 如果没有扭曲，则使用vec3.rotateZ进行旋转
		vec3.rotateZ(a_new, a, zerovec3, radian);
		vec3.rotateZ(b_new, b, zerovec3, radian);
		vec3.rotateZ(c_new, c, zerovec3, radian);

		// 将旋转后的顶点添加到points数组
		points.push(a_new[0], a_new[1], a_new[2]);
		points.push(b_new[0], b_new[1], b_new[2]);
		points.push(b_new[0], b_new[1], b_new[2]);
		points.push(c_new[0], c_new[1], c_new[2]);
		points.push(c_new[0], c_new[1], c_new[2]);
		points.push(a_new[0], a_new[1], a_new[2]);
	} else {
		// 如果有扭曲，则使用不同的旋转方式
		var d_a = Math.sqrt(a[0] * a[0] + a[1] * a[1]);
		var d_b = Math.sqrt(b[0] * b[0] + b[1] * b[1]);
		var d_c = Math.sqrt(c[0] * c[0] + c[1] * c[1]);

		vec3.set(a_new, a[0] * Math.cos(d_a * radian) - a[1] * Math.sin(d_a * radian),
			a[0] * Math.sin(d_a * radian) + a[1] * Math.cos(d_a * radian), 0);
		vec3.set(b_new, b[0] * Math.cos(d_b * radian) - b[1] * Math.sin(d_b * radian),
			b[0] * Math.sin(d_b * radian) + b[1] * Math.cos(d_b * radian), 0);
		vec3.set(c_new, c[0] * Math.cos(d_c * radian) - c[1] * Math.sin(d_c * radian),
			c[0] * Math.sin(d_c * radian) + c[1] * Math.cos(d_c * radian), 0);

		// 将旋转后的顶点添加到points数组
		points.push(a_new[0], a_new[1], a_new[2]);
		points.push(b_new[0], b_new[1], b_new[2]);
		points.push(b_new[0], b_new[1], b_new[2]);
		points.push(c_new[0], c_new[1], c_new[2]);
		points.push(c_new[0], c_new[1], c_new[2]);
		points.push(a_new[0], a_new[1], a_new[2]);

	}
}

function divideTriangle(a, b, c, count) {
	// check for end of recursion
	if (count == 0) {
		tessellaTriangle(a, b, c);
	} else {
		var ab = vec3.create();
		vec3.lerp(ab, a, b, 0.5);
		var bc = vec3.create();
		vec3.lerp(bc, b, c, 0.5);
		var ca = vec3.create();
		vec3.lerp(ca, c, a, 0.5);

		// three new triangles
		divideTriangle(a, ab, ca, count - 1);
		divideTriangle(ab, b, bc, count - 1);
		divideTriangle(ca, bc, c, count - 1);
		divideTriangle(ab, bc, ca, count - 1);
	}
}

function renderTriangles() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.LINES, 0, points.length / 3);// 绘制线条
}