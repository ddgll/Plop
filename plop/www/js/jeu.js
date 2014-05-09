var nbLines = 8;
var nbColumns = 8;
var nbCases = nbLines * nbColumns;
var matrice = {};
var flags = {};
var nbBombs = 10;//Math.round(nbCases * 0.1);
var start = null;
var timer = null;
var keyDown = false;
var mode = 'bomb';
var border = 0;
var highScores = [];
var scores = null;

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
$(document).keydown(function(event){
	if(keyDown === false){
		keyDown = 1;
	}else{
		keyDown++;
	}
});
$(document).keyup(function(){
	keyDown--;
	if(keyDown == 0){
		keyDown == false;
	}
});

$(window).resize(function(){
	//console.log($.mobile.activePage.attr('id'));
	if($.mobile.activePage.attr('id') == 'one'){
		var img = $('#splashImg');
		img.css('display', 'none');
		if($(window).width() > $(window).height()){
			var height = $(window).height() - $('#one .ui-header').height() - $('#level').height() - $('#btnCreateGame').height() - $('#btnHighScore').height() - 30;
			img.css('height', height + 'px');
		}else{
			var width = $(window).width() - 50;
			img.css('width', width + 'px');
		}
		img.css('display', 'block');
		img.css('margin', 'auto');
	}else{
		resizeGame(false);
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
	    
	$('.btnBackMenu').css('border-radius', '15px').css('box-shadow', 'none').css('padding', '15px').css('margin-top', '-2px');
	$('#infos').css('background-color', '#E9E9E9').css('border', '0').css('box-shadow', 'none');
	$('#nbBombs').css('background', 'url("img/bomb.png") no-repeat center center #E9E9E9').css('border', '0').css('box-shadow', 'none');
	$('#timer').css('background-color', '#E9E9E9').css('border', '0').css('box-shadow', 'none');
	
	$('.reset').click(function(){
		startGame();
	});
	
	$('#btnCreateGame').click(function(event){
		event.preventDefault();
		var level = $('#level :selected');
		startPlop();
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
	
	$('.btnBackMenu').click(function(){
		$.mobile.changePage('#one', {transition : 'slide', reverse: true});
	});
	
	if(document.location.hash != '#one'){
		$.mobile.changePage('#one', {transition : null});
	}
	$(window).resize();
};

function resizeGame(reset_){
	
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
