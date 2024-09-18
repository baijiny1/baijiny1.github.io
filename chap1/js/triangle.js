"use strict";

var gl; //存储WebGL上下文
var points; //存储顶点数据

window.onload = function init() {
	var canvas = document.getElementById("triangle-canvas");//通过getElementById()方法获取canvas画布
	gl = canvas.getContext("webgl2");//通过方法getContext()获取WebGL上下文
	if (!gl) {
		alert("WebGL isn't available");
	}

	// 配置WebGL环境
	gl.viewport(0, 0, canvas.width, canvas.height);// 设置视口尺寸与canvas相匹配
	gl.clearColor(1.0, 1.0, 1.0, 1.0);// 设置清除颜色为白色，注意，这里只是设置颜色，并没有正式清除画布颜色，参数为RGBA,a是0.0（透明）~1.0（不透明）

	// 初始化着色器程序并将其应用于当前的WebGL上下文
	var program = initShaders(gl, "vertex-shader", "fragment-shader");//编译顶点着色器和片段着色器，并将它们链接成一个可执行的着色器程序。
	gl.useProgram(program);// 将刚刚创建的着色器程序对象应用到当前的WebGL上下文中,之后，所有的WebGL绘制命令都会使用这个着色器程序来处理顶点和片段。


	//类型数组构造函数Float32Array创建顶点数组
	points = new Float32Array([
		-1.0, -1.0,
		0.0, 1.0,
		1.0, -1.0,
		/*0.0, -1.0,
		 1.0, -1.0,
		 1.0,  1.0,
		 0.0, -1.0,
		 1.0,  1.0,
		 0.0,  1.0*/
		/*-0.5, -0.5,
		0.0, 0.5,
		0.5, -0.5*/
	]);

	// Load the data into the GPU，所有的数据都需要先上传到GPU，WebGL才能进行后续的顶点处理和绘制。
	//1.创建buffer
	var bufferId = gl.createBuffer();
	//2.绑定buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);// 绑定刚才创建的缓冲区对象到ARRAY_BUFFER目标上，之后对ARRAY_BUFFER目标的所有操作都是针对这个绑定的缓冲区对象。
	//3.把数据传给buffer
	// ARRAY_BUFFER目标指定了数据将被存储在哪种类型的缓冲区中
	// points是要上传的顶点数据
	// STATIC_DRAW使用提示告诉WebGL这个缓冲区的数据不会经常改变，适合用于绘制
	gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);//将points数组中的数据传入GPU的缓冲区中，为后续的绘制命令准备好了顶点数据。
	//4.把带有数据的buffer赋值给attribute
	// 获取vPosition
	var vPosition = gl.getAttribLocation(program, "vPosition"); //获取着色器程序中顶点属性的位置索引
	//给vPosition赋值
	//vPosition->指定要配置的顶点属性的位置。
	//2->每个顶点属性中包含的元素数量。这里对应二维坐标，两个元素，buffer中每两个数据是一组，
	//gl.FLOAT缓冲区中的数据类型
	//false指定了是否对属性数据进行标准化
	//0，0跨度和偏移量
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);//告诉WebGL如何从缓冲区中读取顶点数据
	//5.确认第4步
	gl.enableVertexAttribArray(vPosition);//启用顶点属性数组

	//渲染：清空画布和绘制
	render();
}

function render() {
	//清除画布颜色
	gl.clear(gl.COLOR_BUFFER_BIT);//清除颜色缓冲区，确保在新的渲染帧开始之前，画布是干净的
	//gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

	//画

	//drawArrays：从缓冲区中读取顶点数据并绘制图形
	//gl.TRIANGLES：指定了绘制模式为三角形。将顶点数组中的顶点按照每三个一组的方式解释，每组顶点构成一个三角形。
	//0,3：顶点数组中从0索引开始的三个顶点
	gl.drawArrays(gl.TRIANGLES, 0, 3);//从缓冲区中读取顶点数据，并根据顶点数组中的前三个顶点绘制一个三角形
	//gl.drawArrays( gl.TRIANGLE_FANS, 3, 6 );
}