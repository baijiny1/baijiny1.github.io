"use strict";

const { vec4 } = glMatrix;

var canvas;
var gl;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [0, 0, 0];
var translation = [0, 0, 0]; // 平移向量

var thetaLoc;
var translationLoc;

window.onload = function initCube() {
    canvas = document.getElementById("rtcb-canvas");

    gl = canvas.getContext("webgl2");
    if (!gl) {
        gl = canvas.getContext("webgl");
        if (!gl) {
            alert("WebGL isn't available");
            return;
        }
    }

    makeCube();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    // load shaders and initialize attribute buffer
    var program = initShaders(gl, "rtvshader", "rtfshader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");
    translationLoc = gl.getUniformLocation(program, "translation"); // 获取平移向量的uniform变量
    gl.uniform3fv(thetaLoc, theta);
    gl.uniform3fv(translationLoc, translation);

    // 初始化滑块
    $("#xtrans").slider({
        min: -5, max: 5, value: 0, step: 0.1,
        slide: function (event, ui) {
            translation[0] = ui.value;
            gl.uniform3fv(translationLoc, translation);
        }
    });

    $("#ytrans").slider({
        min: -5, max: 5, value: 0, step: 0.1,
        slide: function (event, ui) {
            translation[1] = ui.value;
            gl.uniform3fv(translationLoc, translation);
        }
    });

    $("#ztrans").slider({
        min: -5, max: 5, value: 0, step: 0.1,
        slide: function (event, ui) {
            translation[2] = ui.value;
            gl.uniform3fv(translationLoc, translation);
        }
    });

    document.getElementById("xbutton").onclick = function () {
        axis = xAxis;
    }

    document.getElementById("ybutton").onclick = function () {
        axis = yAxis;
    }

    document.getElementById("zbutton").onclick = function () {
        axis = zAxis;
    }

    render();
}

function makeCube() {
    var vertices = [
        vec4.fromValues(-0.5, -0.5, 0.5, 1.0),
        vec4.fromValues(-0.5, 0.5, 0.5, 1.0),
        vec4.fromValues(0.5, 0.5, 0.5, 1.0),
        vec4.fromValues(0.5, -0.5, 0.5, 1.0),
        vec4.fromValues(-0.5, -0.5, -0.5, 1.0),
        vec4.fromValues(-0.5, 0.5, -0.5, 1.0),
        vec4.fromValues(0.5, 0.5, -0.5, 1.0),
        vec4.fromValues(0.5, -0.5, -0.5, 1.0)
    ];

    var vertexColors = [
        vec4.fromValues(0.0, 0.0, 0.0, 1.0),
        vec4.fromValues(1.0, 0.0, 0.0, 1.0),
        vec4.fromValues(1.0, 1.0, 0.0, 1.0),
        vec4.fromValues(0.0, 1.0, 0.0, 1.0),
        vec4.fromValues(0.0, 0.0, 1.0, 1.0),
        vec4.fromValues(1.0, 0.0, 1.0, 1.0),
        vec4.fromValues(0.0, 1.0, 1.0, 1.0),
        vec4.fromValues(1.0, 1.0, 1.0, 1.0)
    ];

    var faces = [
        [0, 1, 2, 0, 2, 3], // front
        [4, 5, 6, 4, 6, 7], // back
        [0, 4, 5, 0, 5, 1], // bottom
        [2, 3, 7, 2, 7, 6], // top
        [0, 3, 7, 0, 7, 4], // left
        [1, 2, 6, 1, 6, 5]  // right
    ];

    for (var i = 0; i < faces.length; ++i) {
        var face = faces[i];
        for (var j = 0; j < 6; ++j) {
            var index = face[j];
            points.push(vertices[index][0], vertices[index][1], vertices[index][2]);
            colors.push(vertexColors[index][0], vertexColors[index][1], vertexColors[index][2], vertexColors[index][3]);
        }
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += 0.1; // 控制旋转速度
    gl.uniform3fv(thetaLoc, theta);
    gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);
    requestAnimationFrame(render);
}