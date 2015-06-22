function byid(ID){
	return document.getElementById(ID)
}
if (typeof HyperbolicCanvas === "undefined")window.HyperbolicCanvas = {};

var Point = window.Point = window.HyperbolicCanvas.Point;
var Line = window.Line = window.HyperbolicCanvas.Line;
var Circle = window.Circle = window.HyperbolicCanvas.Circle;
var Polygon = window.Polygon = window.HyperbolicCanvas.Polygon;
var Canvas = window.Canvas = window.HyperbolicCanvas.Canvas;

var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
	console.log(e.keyCode)
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

window.onload = function () {
	window.c = HyperbolicCanvas.canvases[0];
	
	c.ctx.fillStyle = '#DD4814';
	byid('game').appendChild(c.el);
	var r = 0.15;
	var player={
		x:0,
		y:0,
		ax:0,
		ay:0,
		maxDis:6,
		rotSpeed:Math.TAU/120,
		rotation:0,
		acceleration:0.002,
		maxSpeed:0.1,
	}
	
	var fn = function () {
		if(37 in keysDown || 65 in keysDown)player.rotation+=player.rotSpeed//left key or A key
		if(39 in keysDown || 68 in keysDown)player.rotation-=player.rotSpeed//right key or D key
		if(38 in keysDown){
			var vec=Point.CENTER.distantPoint(player.acceleration, player.rotation)
			player.ax+=2 * Math.atanh(vec.x)
			player.ay+=2 * Math.atanh(vec.y)
		}
		
		if(40 in keysDown){
			var vec=Point.CENTER.distantPoint(player.acceleration, player.rotation+Math.PI)
			player.ax+=2 * Math.atanh(vec.x)
			player.ay+=2 * Math.atanh(vec.y)
		}
		
		var speed=new Point({
			x:Math.tanh(player.ax/2),
			y:Math.tanh(player.ay/2)
		}).distanceFromCenter();
		
		if(speed>player.speed){
			player.ax=(player.ax/dis)*player.maxSpeed
			player.ay=(player.ay/dis)*player.maxSpeed
		}
		
		player.x+=player.ax
		player.y+=player.ay
		
		var dis=new Point({
			x:Math.tanh(player.x/2),
			y:Math.tanh(player.y/2)
		}).distanceFromCenter();
		
		if(dis>player.maxDis){
			player.x=(player.x/dis)*-player.maxDis
			player.y=(player.y/dis)*-player.maxDis
			console.log(player.x,player.y)
		}
		
		c.ctx.clearRect(0, 0, c.diameter, c.diameter);
		var color='#F00'
		c.ctx.shadowColor = color;
		c.ctx.shadowBlur = 40;
		c.ctx.strokeStyle = color;
		c.ctx.lineWidth = 2;
		var polygons = [];
		var i=0;
		var j=0;
		
		
		//var gon = Polygon.fromNCenterRadius(n, point, 2 * Math.atanh(r), rotation);
		
		var point=new Point({
			x:Math.tanh(player.x/2),
			y:Math.tanh(player.y/2)
		})
		var radius=2 * Math.atanh(r)
		var vertices = [point.distantPoint(radius, Math.TAU*(0/3)+player.rotation),
						point.distantPoint(radius, Math.TAU*((1.0+0.17)/3)+player.rotation),
						point.distantPoint(radius*0.3, Math.TAU*(1.5/3)+player.rotation),
						point.distantPoint(radius, Math.TAU*((2.0-0.17)/3)+player.rotation)]
						
		
		var gon=new Polygon({ vertices: vertices });
		c.strokePolygon(gon)
		setTimeout(fn,1000/60)
	};
	fn()
	reRender = false;
};

window.onresize=function(){
	var size=Math.min(innerWidth,innerHeight)
	var per=size/byid('content').offsetWidth
	
	byid('content').style.transform='scale('+per+')'
	if(per<1)per=1
	console.log(per)
	//byid('content').style.margin=(byid('content').offsetWidth*per)+'px'
	byid('content').style.left=(innerWidth/2)-(size)/2+'px'
	byid('content').style.top=(innerHeight/2)-(size)/2+'px'
}
onresize()

byid('creditsButton').onclick=function(){
	byid('credits').style.display='block'
	byid('main-menu').style.display='none'	
}

byid('newGame').onclick=function(){
	byid('game').style.display='block'
	byid('main-menu').style.display='none'
}
