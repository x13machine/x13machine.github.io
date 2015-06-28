if (typeof HyperbolicCanvas === "undefined")window.HyperbolicCanvas = {};
var keyboard = new THREEx.KeyboardState();
var Point = window.Point = window.HyperbolicCanvas.Point;
var Line = window.Line = window.HyperbolicCanvas.Line;
var Circle = window.Circle = window.HyperbolicCanvas.Circle;
var Polygon = window.Polygon = window.HyperbolicCanvas.Polygon;
var Canvas = window.Canvas = window.HyperbolicCanvas.Canvas;

var lastFrame=0;

var r = 0.15;
var radius=2 * Math.atanh(r)
var maxDistance=4

var ememys=[]


for(var i=0;i<10;i++){
	var loc=Point.CENTER.distantPoint(Math.random()*maxDistance,Math.random()*Math.TAU)
	ememys.push({
		type:'blah',
		x:2*Math.atanh(loc.x),
		y:2*Math.atanh(loc.y),
		ax:0,
		ay:0,
		angle:Math.random()*Math.TAU
	})
}

var player={
	x:0,
	y:0,
	ax:0,
	ay:0,
	rotSpeed:Math.TAU/1200,
	rotation:0,
	acceleration:0.00005,
	maxSpeed:0.003,
}
var bulletSpeed=0.005
var bulletRate=1000/10 // 10 hertz
var bulletLastFire=0;
var bullets=[]

var fps=0
var frames=0
var fn = function () {
	frames++
	//how much time has pasted since last frame
	var now=new Date().getTime()
	var milliChange=now-lastFrame
	var change=milliChange/1000
	lastFrame=now
	if(change>1){
		requestAnimFrame(fn)
		return ;
	}
	if(keyboard.pressed('left') || keyboard.pressed('A'))player.rotation+=player.rotSpeed*milliChange
	if(keyboard.pressed('right') || keyboard.pressed('D'))player.rotation-=player.rotSpeed*milliChange
	
	if(keyboard.pressed('up') || keyboard.pressed('W')){//up key or W key
		var vec=Point.CENTER.distantPoint(player.acceleration, player.rotation)
		player.ax+=2 * Math.atanh(vec.x)
		player.ay+=2 * Math.atanh(vec.y)
	}
	
	if(keyboard.pressed('down') || keyboard.pressed('S')){//down key or S key
		var vec=Point.CENTER.distantPoint(player.acceleration, player.rotation+Math.PI)
		player.ax+=2 * Math.atanh(vec.x)
		player.ay+=2 * Math.atanh(vec.y)
	
	}
	
	//limit speed
	
	var vec=new Point({
		x:Math.tanh(player.ax/2),
		y:Math.tanh(player.ay/2)
	})
	var speed=vec.distanceFromCenter();
	if(speed>player.maxSpeed){
		vec=Point.CENTER.distantPoint(player.maxSpeed,vec.distantPoint().direction)
		speed=vec.distanceFromCenter();
		player.ax=2 * Math.atanh(vec.x)
		player.ay=2 * Math.atanh(vec.y)
	}
	
	if(keyboard.pressed('space')){//space bar
		if(now-bulletLastFire>bulletRate){
			bulletLastFire=now
			var point=new Point({
				x:Math.tanh(player.x/2),
				y:Math.tanh(player.y/2)
			}).distantPoint(radius*0.3,player.rotation)
			bullets.push({
				point:point,
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
		var location=Point.CENTER.distantPoint(maxDistance,location.distantPoint().direction+Math.PI)
		player.x=2 * Math.atanh(location.x)
		player.y=2 * Math.atanh(location.y)
	}
	
	//clears screen
	c.ctx.clearRect(0, 0, c.diameter, c.diameter);
	c.ctx.shadowBlur = 25;
	
	//border
	var rad=c.viewport.offsetWidth/2
	var color='#0F0'
	c.ctx.shadowColor = color;
	c.ctx.strokeStyle = color;
	c.ctx.lineWidth = 0;
	
	c.ctx.beginPath();
	c.ctx.arc(rad, rad, rad, 0, 2 * Math.PI, false);
	c.ctx.stroke();	
	
	//renders ememys
	
	for(var i in ememys){
		var ememy=ememys[i]
		var color='#00F'
		c.ctx.shadowColor = color;
		c.ctx.strokeStyle = color;
		c.ctx.lineWidth = 2;
		
		var point=new Point({
			x:Math.tanh(ememy.x/2),
			y:Math.tanh(ememy.y/2)
		})
		
		var vertices = [
			point.distantPoint(radius/2, Math.TAU*(0/3)+ememy.angle),
			point.distantPoint(radius/2, Math.TAU*(1/3)+ememy.angle),
			point.distantPoint((radius/2)*0.3, Math.TAU*(2/3)+ememy.angle)
		]
		
		var gon=new Polygon({ vertices: vertices });
		c.strokePolygon(gon)
	}
	
	//renders player
	var color='#F00'
	c.ctx.shadowColor = color;

	c.ctx.strokeStyle = color;
	c.ctx.lineWidth = 2;
	
	var point=new Point({
		x:Math.tanh(player.x/2),
		y:Math.tanh(player.y/2)
	})
	
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

setInterval(function(){
	console.log(frames)
	frames=0
},1000)
