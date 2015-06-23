function byid(ID){
	return document.getElementById(ID)
}
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

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
	lastFrame=new Date().getTime()
	fn()
}

window.onload = function () {
	window.c = HyperbolicCanvas.canvases[0];
	c.ctx.fillStyle = '#DD4814';
	byid('game').appendChild(c.el);
};
