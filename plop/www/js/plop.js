//map.fill();

/*var joueur = new Bulle(2, 5);

map.addBulle(joueur);*/
var width = 64;
function startPlop() {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	
	var w = window,
	    d = document,
	    e = d.documentElement,
	    g = d.getElementsByTagName('body')[0],
	    wWidth = w.innerWidth || e.clientWidth || g.clientWidth,
	    wHeight = w.innerHeight|| e.clientHeight|| g.clientHeight;
	wHeight -= 50;
	if(wHeight > wWidth){
		width = wWidth / 10;
	}else{
		width = wHeight / 10;
	}
	var map = new Map("premiere", width);
	
	canvas.width  = map.getLargeur() * width;
	canvas.height = map.getHauteur() * width;
	
	setInterval(function() {
	    map.dessinerMap(ctx);
	}, 28);
	
	setInterval(function() {
		// console.log(map);
		if(!map.isAnimate() && !map.canPlay()){
			//console.log('Fini');
			map.fill();
		}
	}, 200);
	
	document.getElementById('canvas').onclick = function(event){
		var e = event || window.event;
		var x = e.clientX || e.pageX;
		var y = e.clientY || e.pageY;
		
		x -= canvas.offsetLeft;
		y -= canvas.offsetTop;
		
		//map.clickCoord(x, y);return true;
		if(!map.isAnimate()){
			//map.clickCoord(x, y);
			var nbRemove = map.removeBulle(map.clickCoord(x, y));
			//console.log(nbRemove);
			map.calcScore(nbRemove);
		}
	}
}