var start = null;
var timer = null;
var highScores = [];
var scores = null;
var map = null;

if (!localStorage) {
	alert('Your terminal is to old to run Plop');
}

document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown() {
    
}
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady(){
	initJeu();
}

var tplScoreLine = '<li><a href="javascript:;">{{number}} - {{name}} <span class="ui-li-count" style="text-transform: none;">{{{score}}}</span></a></li>';

$(document).ready(function(){
	if (!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        onDeviceReady();
    }
});

$(document).bind("contextmenu", function(e) {
    return false;
});

$(window).resize(function(){
	//console.log($.mobile.activePage.attr('id'));
	if($.mobile.activePage.attr('id') == 'two'){
		resizeGame();
	}
});

function initJeu(){
	scores = new Scores();
	//scores.flush();
	$('div[data-role="dialog"]').on('pagebeforeshow', function(e, ui) {
	    ui.prevPage.addClass("ui-dialog-background ");
	});

	$('div[data-role="dialog"]').on('pagehide', function(e, ui) {
	    $(".ui-dialog-background ").removeClass("ui-dialog-background ");
	});
	
	$('.reset').click(function(){
		startGame();
	});
	
	$('a[data-action="startGame"]').click(function(event){
		event.preventDefault();
		startGame($(this).data('mode'));
	});
	
	$('#btnHighScore').click(function(){
		$.mobile.changePage('#three', {transition : 'slide'});
		$('#levelHS').change();
	});
	
	$('#levelHS').change(function(){
		var level = $(this).val();
		//console.log(level);
		scores.load();
		var scoresTab = scores.getScores(level);
		//console.log(scoresTab);
		var list = $('#scoreList');
		list.html('');
		if(scoresTab.length > 0){
			for(var i in scoresTab){
				list.append(Mustache.to_html(tplScoreLine, {number: (i*1+1), name: scoresTab[i].name, score: scoresTab[i].score}));
			}
		}else{
			list.html('<li>No High Score yet for this level</li>')
		}
		list.listview('refresh');
	});
	
	$('#btnCloseWin').click(function(){
		var name = $('#name').val();
		if(name != ''){
			localStorage['name'] = name;
		}else{
			name = 'John Doe';
		}
		scores.add(name, $('#finishTime').html(), $('#level').val());
	});
	
	$('a[data-action="btnBackMenu"]').click(function(){
		$.mobile.changePage('#one', {transition : 'slide', reverse: true});
	});
	
	if(document.location.hash != '#one'){
		$.mobile.changePage('#one', {transition : null});
	}
	//$(window).resize();
};

function startGame(){
	if($.mobile.activePage && $.mobile.activePage.attr('id') != 'two'){
		$.mobile.changePage('#two', {transition : 'slide'});
		setTimeout(startGame, 500);
	}else{
		startPlop();
		resizeGame();
	}
}

function resizeGame(){
	if(map != null){
		var w = window,
	    d = document,
	    e = d.documentElement,
	    g = d.getElementsByTagName('body')[0],
	    wWidth = w.innerWidth || e.clientWidth || g.clientWidth,
	    wHeight = w.innerHeight|| e.clientHeight|| g.clientHeight;

		wHeight -= $('#two .ui-header').height() + parseInt($('#plopGame').css('padding-top')) * 2 + 10;
		if(wHeight > wWidth){
			width = wWidth / map.getLargeur();
		}else{
			width = wHeight / map.getLargeur();
		}
		
		$('#infos').css('line-height', $('#two .ui-header').height() + 'px').css('display', 'block');
		
		map.setWidth(width);
		canvas.width  = map.getLargeur() * width;
		canvas.height = map.getLargeur() * width;
	}
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
	timer = setTimeout(addTime, 10);
}

function loose(){
	$.mobile.changePage( "#looseDialog", { role: "dialog" } );
	finish();
}
