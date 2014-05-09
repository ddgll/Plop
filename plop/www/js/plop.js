//map.fill();

/*var joueur = new Bulle(2, 5);

map.addBulle(joueur);*/
var width = 64;
var drawInterval = null;
var gameInterval = null;
function startPlop() {
	document.getElementById('plopGame').innerHTML = '<canvas id="canvas" style="margin: auto; display: block;">Votre navigateur ne supporte pas HTML5, veuillez le mettre à jour pour jouer.</canvas>';
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	
	map = new Map("premiere");
	
	map.setBackground($(document.body).css('background-color'));
	
	if(gameInterval != null){
		clearInterval(drawInterval);
	}
	drawInterval = setInterval(function() {
	    map.dessinerMap(ctx);
	}, 28);
	
	if(gameInterval != null){
		clearInterval(gameInterval);
	}
	gameInterval = setInterval(function() {
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