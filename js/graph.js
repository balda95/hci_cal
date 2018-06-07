var mathjs = require('mathjs');

var canvas = document.getElementById("graph");
var ctx = canvas.getContext("2d");

ctx.fillStyle = "#0000FF";
var width = canvas.width;
var height = canvas.height;
var center = width/2;

function plot(){
	ctx.fillStyle = $("#color").val();
	var f = mathjs.eval('f(x) = '+($("#function").val()));
	try{
		for(var x = -250;x<250;x+=0.001){
			ctx.fillRect(center/10+x,center/10-f(x),0.1,0.1);	
		}
		$("#errortr").hide();
	}
	catch(e){
		$("#errortr").show();
		$("#errorp").text("Syntax error or invalid function.");
		throw new Error("Syntax error or invalid function sent to mathjs.");
	}
}

function drawGrid(){
	ctx.beginPath();
	for(var x = 0;x<width; x+=width/50){
		ctx.moveTo(x,0);
		ctx.lineTo(x,width);
	}
	for(var y = 0;y<height; y+=height/50){
		ctx.moveTo(0,y);
		ctx.lineTo(height,y);
	}
	ctx.strokeStyle = "#b3b3b3";
	ctx.stroke();
}

function drawAxes(){
	ctx.beginPath();
	ctx.moveTo(center,0);
	ctx.lineTo(center,height);
	ctx.moveTo(0,center);
	ctx.lineTo(width,center);
	ctx.strokeStyle = "#000000";
	ctx.stroke();
}

function clearGraph(){
	ctx.restore();
	ctx.clearRect(0, 0, width, height);
	drawGrid();
	drawAxes();
	ctx.save();
	ctx.scale(10,10);
}

$("#errortr").hide();
drawGrid();
drawAxes();
ctx.save();
ctx.scale(10,10);