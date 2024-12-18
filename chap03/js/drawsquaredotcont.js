"use strict";

const { vec2, vec4 } = glMatrix;

var canvas;
var gl;

var maxNumTriangles = 500;
var maxNumVertices = 3 * maxNumTriangles;
var index = 0;// 用于跟踪当前绘制的顶点索引

var redraw = false;// 标志变量，用于控制是否需要重新绘制

var colors = [
	0.0, 0.0, 0.0, 1.0, // black
	1.0, 0.0, 0.0, 1.0 , // red
	1.0, 1.0, 0.0, 1.0 , // yellow
	0.0, 1.0, 0.0, 1.0 , // green
	0.0, 0.0, 1.0, 1.0 , // blue
	1.0, 0.0, 1.0, 1.0 , // magenta
	0.0, 1.0, 1.0, 1.0  // cyan
];

function initSquare(){
	canvas = document.getElementById( "dot-canvas" );
	gl = canvas.getContext("webgl2");
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.5, 0.5, 0.5, 1.0 );
// 为canvas添加鼠标按下事件监听器，设置redraw为true
	canvas.addEventListener( "mousedown", function( event ){
		redraw = true;
	});
 // 为canvas添加鼠标松开事件监听器，设置redraw为false
	canvas.addEventListener( "mouseup", function( event ){
		redraw = false;
	});
 // 为canvas添加鼠标移动事件监听器，如果redraw为true，则绘制点
	canvas.addEventListener( "mousemove", function( event ){
		if( redraw ){
			gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
			var rect = canvas.getBoundingClientRect();// 获取canvas的边界
			var cx = event.clientX - rect.left;// 计算鼠标相对于canvas的x坐标
			var cy = event.clientY - rect.top; // offset
			var t = vec2.fromValues( 2 * cx / canvas.width - 1, 2 * ( canvas.height - cy ) / canvas.height - 1 );
			gl.bufferSubData( gl.ARRAY_BUFFER, 8 * index, new Float32Array( t ) );

			gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
			var c = vec4.fromValues( colors[index%7*4], colors[index%7*4+1], colors[index%7*4+2], colors[index%7*4+3]);// 获取颜色
			gl.bufferSubData( gl.ARRAY_BUFFER, 16 * index, new Float32Array( c ) );
			index++;// 增加索引
		}
	} );

	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	var vBuffer = gl.createBuffer(); //position
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	var cBuffer = gl.createBuffer(); // color
	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW );

	var vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vColor );

	renderSquare();

}

function renderSquare(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	gl.drawArrays( gl.POINTS, 0, index );

	window.requestAnimFrame( renderSquare );// 请求下一帧动画
}