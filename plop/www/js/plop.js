//map.fill();

/*var joueur = new Bulle(2, 5);

map.addBulle(joueur);*/
var width = 64;
var nbCoups = 20;
var timer = null;
var drawInterval = null;
var gameInterval = null;
function startPlop() {
	console.log('Start plop !');
	if(timer != null){
		clearInterval(timer);
		start = null;
	}
	document.getElementById('plopGame').innerHTML = '<canvas id="canvas" style="margin: auto; display: block;">Votre navigateur ne supporte pas HTML5, veuillez le mettre à jour pour jouer.</canvas>';
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	
	map = new Map("premiere");
	
	map.setBackground($(document.body).css('background-color'));
	
	if(gameInterval != null){
		clearInterval(drawInterval);
	}
	drawInterval = setInterval(function() {
		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.restore();
	    map.dessinerMap(ctx);
	}, 40);
	
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
		//if(!map.isAnimate()){
			//map.clickCoord(x, y);
			var bulle = map.clickCoord(x, y);
			if(bulle && map.hasNeighbor(bulle)){
				var nbRemove = map.removeBulle(bulle);
				map.calcScore(nbRemove);
			}else{
				console.log('No neighbor');
			}
		//}
	};

	start = Date.now();
	setInterval(addTime, 100);
}



function addTime(){
	var diff = Date.now() - start;
	var minutes = 0;
	var seconds = Math.floor(diff / 1000);
	var milli = Math.floor((diff - seconds * 1000) / 10);
	if(seconds > 60){
		minutes = Math.floor(seconds / 60);
		seconds = seconds - minutes * 60;
	}
	if(seconds < 9){
		seconds = '0' + seconds;
	}
	if(milli < 9){
		milli = '0' + milli;
	}
	if(minutes > 0){
		$('#timer').html(minutes + ':' + seconds + '.' + milli);
	}else{
		$('#timer').html(seconds + '.' + milli);
	}
}