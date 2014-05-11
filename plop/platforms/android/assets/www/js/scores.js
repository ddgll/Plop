
var Scores = function(){
	this.scores = {
		'beginer': [],
		'intermediate': [],
		'expert': [],
		'insane': []
	};
}

Scores.prototype.load = function(){
	if(localStorage['HSbeginer']){
		this.scores['beginer'] = [];
		var tmp = localStorage['HSbeginer'].split('#@#');
		for(var i in tmp){
			var score = tmp[i].split('|@|');
			this.scores['beginer'].push({name: score[0], score: score[1]});
		}
		this.scores['beginer'].sort(function(a, b){
			return a.score > b.score;
		});
	}
	if(localStorage['HSintermediate']){
		this.scores['intermediate'] = [];
		var tmp = localStorage['HSintermediate'].split('#@#');
		for(var i in tmp){
			var score = tmp[i].split('|@|');
			this.scores['intermediate'].push({name: score[0], score: score[1]});
		}
		this.scores['intermediate'].sort(function(a, b){
			return a.score > b.score;
		});
	}
	if(localStorage['HSexpert']){
		this.scores['expert'] = [];
		var tmp = localStorage['HSexpert'].split('#@#');
		for(var i in tmp){
			var score = tmp[i].split('|@|');
			this.scores['expert'].push({name: score[0], score: score[1]});
		}
		this.scores['expert'].sort(function(a, b){
			return a.score > b.score;
		});
	}
	if(localStorage['HSinsane']){
		this.scores['insane'] = [];
		var tmp = localStorage['HSinsane'].split('#@#');
		for(var i in tmp){
			var score = tmp[i].split('|@|');
			this.scores['insane'].push({name: score[0], score: score[1]});
		}
		this.scores['insane'].sort(function(a, b){
			return a.score > b.score;
		});
	}
}

Scores.prototype.add = function(name_, score_, type_){
	//console.log(type_);
	this.scores[type_].push({name: name_, score: score_});
	this.scores[type_].sort(function(a, b){
		return a.score > b.score;
	});
	this.save();
}

Scores.prototype.flush = function(name_, score_, type_){
	this.scores = {
		'beginer': [],
		'intermediate': [],
		'expert': [],
		'insane': []
	};
	this.save();
}

Scores.prototype.save = function(){
	for(var type in this.scores){
		var tmp = '';
		for(var i in this.scores[type]){
			if(tmp != ''){
				tmp += '#@#';
			}
			tmp += this.scores[type][i].name + '|@|' + this.scores[type][i].score;
		}
		localStorage['HS' + type] = tmp;
	}
}

Scores.prototype.getScores = function(type_){
	//console.log('getScores type : ' + type_);
	return this.scores[type_];
}
