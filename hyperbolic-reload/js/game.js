if (typeof HyperbolicCanvas === "undefined")window.HyperbolicCanvas = {};

var Point = window.Point = window.HyperbolicCanvas.Point;
var Line = window.Line = window.HyperbolicCanvas.Line;
var Circle = window.Circle = window.HyperbolicCanvas.Circle;
var Polygon = window.Polygon = window.HyperbolicCanvas.Polygon;
var Canvas = window.Canvas = window.HyperbolicCanvas.Canvas;

var keysDown = {};
var lastFrame=0;

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);


var r = 0.15;

var maxDistance=4
var player={
	x:0,
	y:0,
	ax:0,
	ay:0,

	rotSpeed:Math.TAU/1000,
	rotation:0,
	acceleration:0.00005,
	maxSpeed:0.005,
}
var bulletSpeed=0.005
var bulletRate=1000/10 // 10 hertz
var bulletLastFire=0;
var bullets=[]
var fn = function () {
	
	//how much time has pasted since last frame
	var now=new Date().getTime()
	var milliChange=now-lastFrame
	var change=milliChange/1000
	lastFrame=now
	if(change>1){
		requestAnimFrame(fn)
		return ;
	}
	if(37 in keysDown || 65 in keysDown)player.rotation+=player.rotSpeed*milliChange//left key or A key
	if(39 in keysDown || 68 in keysDown)player.rotation-=player.rotSpeed*milliChange//right key or D key
	
	player.lax=player.ax
	player.lay=player.ay
	player.lx=player.x
	player.ly=player.y
	if(38 in keysDown || 87 in keysDown){//up key or W key
		var vec=Point.CENTER.distantPoint(player.acceleration, player.rotation)
		player.ax+=2 * Math.atanh(vec.x)
		player.ay+=2 * Math.atanh(vec.y)
	}
	
	if(40 in keysDown || 83 in keysDown){//down key or S key
		var vec=Point.CENTER.distantPoint(player.acceleration, player.rotation+Math.PI)
		player.ax+=2 * Math.atanh(vec.x)
		player.ay+=2 * Math.atanh(vec.y)
	
	}
	
	//limit speed
	var speed=new Point({x:player.ax,y:player.ay}).distanceFromCenter();
	console.log(speed)
	if(speed>player.maxSpeed){
		player.ax=player.lax
		player.ay=player.lay
	}
	
	if(32 in keysDown){//space bar
		if(now-bulletLastFire>bulletRate){
			bulletLastFire=now
			bullets.push({
				point:new Point({
					x:Math.tanh(player.x/2),
					y:Math.tanh(player.y/2)
				}),
				angle:player.rotation
			})
		}
	}
	
	//updates bullets
	for(var i in bullets){
		bullets[i].point=bullets[i].point.distantPoint(bulletSpeed*milliChange, bullets[i].angle)
		
		if(bullets[i].point.distanceFromCenter()>maxDistance){
			bullets.splice(i, 1);
		}
	}
	
	//updates player
	player.x+=player.ax*milliChange
	player.y+=player.ay*milliChange
	
	var location=new Point({
		x:Math.tanh(player.x/2),
		y:Math.tanh(player.y/2)
	})
	
	//warp the player around
	var currentDistance = location.distanceFromCenter();
	if (currentDistance > maxDistance) {
		player.x=-player.lx
		player.y=-player.ly
	}
	
	//clears screen
	c.ctx.clearRect(0, 0, c.diameter, c.diameter);
	
	//border
	var rad=c.viewport.offsetWidth/2
	var color='#0F0'
	c.ctx.shadowColor = color;
	c.ctx.shadowBlur = 25;
	c.ctx.strokeStyle = color;
	c.ctx.lineWidth = 0;
	
	c.ctx.beginPath();
	c.ctx.arc(rad, rad, rad, 0, 2 * Math.PI, false);
	c.ctx.stroke();	
	
	//renders player
	var color='#F00'
	c.ctx.shadowColor = color;
	c.ctx.shadowBlur = 40;
	c.ctx.strokeStyle = color;
	c.ctx.lineWidth = 2;
	var i=0;
	var j=0;
	
	var point=new Point({
		x:Math.tanh(player.x/2),
		y:Math.tanh(player.y/2)
	})
	var radius=2 * Math.atanh(r)
	var vertices = [
		point.distantPoint(radius, Math.TAU*(0/3)+player.rotation),
		point.distantPoint(radius, Math.TAU*((1.0+0.17)/3)+player.rotation),
		point.distantPoint(radius*0.3, Math.TAU*(1.5/3)+player.rotation),
		point.distantPoint(radius, Math.TAU*((2.0-0.17)/3)+player.rotation)
	]
	
	var gon=new Polygon({ vertices: vertices });
	c.strokePolygon(gon)

	//renders bullets
	
	var color='#FF0'
	c.ctx.shadowColor = color;
	c.ctx.strokeStyle = color;
	
	for(var i in bullets){
		var p=Polygon.givenNCenterRadius(4,bullets[i].point,0.03,bullets[i].angle+Math.PI/4)
		c.strokePolygon(p);
	}
	
	requestAnimFrame(fn)
};

