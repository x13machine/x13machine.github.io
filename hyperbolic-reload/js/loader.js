
var tl = new TimelineMax({
  repeat: -1
});

var fromSky = {
  scale: 0,
  opacity: 0,
  y: -8000
};

var toViewport = {
  y: 0,
  scale: 1,
  opacity: 1,
  ease: Back.easeInOut
}

var toGround = {
  scale: 0,
  y: 8000,
  opacity: 0,
  ease: Circ.easeInOut
}

var polygons = document.querySelectorAll('svg polygon');

tl.staggerFromTo(polygons, 1, fromSky, toViewport, 0.025, 0)
       .staggerTo(polygons, 0.875, toGround, 0.0375, '+=0.125');
       

var percent=0
function load(){
	percent++;
	var pols=polygons.length;
	for(var i=0;i<pols;i++){
		polygons[i].style.display=(i/pols>percent/100)?'none':'block'
	}
	if(percent>=100){
		byid('loader').style.display='none'
		byid('playButton').style.display='block'
	}else{
		setTimeout(load,200)
	}
}

load();

byid('playButton').onclick=function(){
	byid('loading-screen').style.display='none'
	byid('main-menu').style.display='block'
}
