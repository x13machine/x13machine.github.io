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

var maxDistance=6
var player={
	x:0,
	y:0,
	ax:0,
	ay:0,

	rotSpeed:Math.TAU/1000,
	rotation:0,
	acceleration:0.00005,
	maxSpeed:0.1,
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

	if(37 in keysDown || 65 in keysDown)player.rotation+=player.rotSpeed*milliChange//left key or A key
	if(39 in keysDown || 68 in keysDown)player.rotation-=player.rotSpeed*milliChange//right key or D key

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
		/* weird mess
			// doesn't work
			var newPoint = Point.givenHyperbolicPolarCoordinates(2 * maxDistance - currentDistance, player.rotation + Math.PI);
			//console.log(newPoint)
			player.x=2 * Math.atanh(newPoint.x);
			player.y=2 * Math.atanh(newPoint.y);
		*/
		
		//this doesn't work either
		player.x=-player.x
		player.y=-player.y
	}
	
	//clears screen
	c.ctx.clearRect(0, 0, c.diameter, c.diameter);
	
	
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

