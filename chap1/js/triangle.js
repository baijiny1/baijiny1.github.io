"use strict";

var gl; //�洢WebGL������
var points; //�洢��������

window.onload = function init() {
	var canvas = document.getElementById("triangle-canvas");//ͨ��getElementById()������ȡcanvas����
	gl = canvas.getContext("webgl2");//ͨ������getContext()��ȡWebGL������
	if (!gl) {
		alert("WebGL isn't available");
	}

	// ����WebGL����
	gl.viewport(0, 0, canvas.width, canvas.height);// �����ӿڳߴ���canvas��ƥ��
	gl.clearColor(1.0, 1.0, 1.0, 1.0);// ���������ɫΪ��ɫ��ע�⣬����ֻ��������ɫ����û����ʽ���������ɫ������ΪRGBA,a��0.0��͸����~1.0����͸����

	// ��ʼ����ɫ�����򲢽���Ӧ���ڵ�ǰ��WebGL������
	var program = initShaders(gl, "vertex-shader", "fragment-shader");//���붥����ɫ����Ƭ����ɫ���������������ӳ�һ����ִ�е���ɫ������
	gl.useProgram(program);// ���ոմ�������ɫ���������Ӧ�õ���ǰ��WebGL��������,֮�����е�WebGL���������ʹ�������ɫ���������������Ƭ�Ρ�


	//�������鹹�캯��Float32Array������������
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

	// Load the data into the GPU�����е����ݶ���Ҫ���ϴ���GPU��WebGL���ܽ��к����Ķ��㴦��ͻ��ơ�
	//1.����buffer
	var bufferId = gl.createBuffer();
	//2.��buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);// �󶨸ղŴ����Ļ���������ARRAY_BUFFERĿ���ϣ�֮���ARRAY_BUFFERĿ������в��������������󶨵Ļ���������
	//3.�����ݴ���buffer
	// ARRAY_BUFFERĿ��ָ�������ݽ����洢���������͵Ļ�������
	// points��Ҫ�ϴ��Ķ�������
	// STATIC_DRAWʹ����ʾ����WebGL��������������ݲ��ᾭ���ı䣬�ʺ����ڻ���
	gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);//��points�����е����ݴ���GPU�Ļ������У�Ϊ�����Ļ�������׼�����˶������ݡ�
	//4.�Ѵ������ݵ�buffer��ֵ��attribute
	// ��ȡvPosition
	var vPosition = gl.getAttribLocation(program, "vPosition"); //��ȡ��ɫ�������ж������Ե�λ������
	//��vPosition��ֵ
	//vPosition->ָ��Ҫ���õĶ������Ե�λ�á�
	//2->ÿ�����������а�����Ԫ�������������Ӧ��ά���꣬����Ԫ�أ�buffer��ÿ����������һ�飬
	//gl.FLOAT�������е���������
	//falseָ�����Ƿ���������ݽ��б�׼��
	//0��0��Ⱥ�ƫ����
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);//����WebGL��δӻ������ж�ȡ��������
	//5.ȷ�ϵ�4��
	gl.enableVertexAttribArray(vPosition);//���ö�����������

	//��Ⱦ����ջ����ͻ���
	render();
}

function render() {
	//���������ɫ
	gl.clear(gl.COLOR_BUFFER_BIT);//�����ɫ��������ȷ�����µ���Ⱦ֡��ʼ֮ǰ�������Ǹɾ���
	//gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

	//��

	//drawArrays���ӻ������ж�ȡ�������ݲ�����ͼ��
	//gl.TRIANGLES��ָ���˻���ģʽΪ�����Ρ������������еĶ��㰴��ÿ����һ��ķ�ʽ���ͣ�ÿ�鶥�㹹��һ�������Ρ�
	//0,3�����������д�0������ʼ����������
	gl.drawArrays(gl.TRIANGLES, 0, 3);//�ӻ������ж�ȡ�������ݣ������ݶ��������е�ǰ�����������һ��������
	//gl.drawArrays( gl.TRIANGLE_FANS, 3, 6 );
}