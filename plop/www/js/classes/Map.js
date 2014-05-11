function Map(nom) {
    // Création de l'objet XmlHttpRequest
    var xhr = getXMLHttpRequest();

    // Chargement du fichier
    xhr.open("GET", './maps/' + nom + '.json', false);
    xhr.send(null);
    if(xhr.readyState != 4 || (xhr.status != 200 && xhr.status != 0)) // Code == 0 en local
    	throw new Error("Impossible de charger la carte nommée \"" + nom + "\" (code HTTP : " + xhr.status + ").");
    var mapJsonData = xhr.responseText;
    
    // Analyse des données
    var mapData = JSON.parse(mapJsonData);
    
    this.width = 32;
    this.background = 'white';

    // Tileset
    this.tileset = new Tileset(mapData.tileset);
    this.terrain = mapData.terrain;
    
    this.bulles = new Array();
    for(var i = 0; i < this.terrain.length; i++) {
        for(var j = 0; j < this.terrain[i].length ; j++) {
        	this.bulles.push(new Bulle(i, j, this));
        	this.terrain[i][j] = true;
        }
    }
    this.animated = 0;
    this.play = true;
    this.score = 0;
    this.multiplier = 1;
}

Map.prototype.hasNeighbor = function(bulle){
	var coords = bulle.getCoords();
	var bottom = this.getBulle({x: coords.x, y: coords.y-1});
    if(bottom != null && bottom.getColor() == bulle.getColor()){
    	return true;
    }
    var top =  this.getBulle({x: coords.x, y: coords.y+1*1});
    if(top != null && top.getColor() == bulle.getColor()){
    	return true;
    }
    var right = this.getBulle({x: coords.x+1*1, y: coords.y});
    if(right != null && right.getColor() == bulle.getColor()){
    	return true;
    }
    var left = this.getBulle({x: coords.x-1, y: coords.y});
    if(left != null && left.getColor() == bulle.getColor()){
    	return true;
    }
    
    return false;
}

//Pour récupérer la taille (en tiles) de la carte
Map.prototype.animate = function() {
	this.animated++;
}

//Pour récupérer la taille (en tiles) de la carte
Map.prototype.setWidth = function(width) {
	this.width = width;
}

//Pour récupérer la taille (en tiles) de la carte
Map.prototype.setBackground = function(bkColor) {
	this.background = bkColor;
}

//Pour récupérer la taille (en tiles) de la carte
Map.prototype.isAnimate = function() {
	return this.animated > 0;
}
//Pour récupérer la taille (en tiles) de la carte
Map.prototype.unanimate = function() {
	this.animated--;
	if(this.animated == 0){
		this.play = false;
    	for(var i = 0; i < this.bulles.length; i++){
        	if(this.hasNeighbor(this.bulles[i])){
        		this.play = true;
        	}
        }
	}
}

//Pour récupérer la taille (en tiles) de la carte
Map.prototype.getHauteur = function() {
return this.terrain.length;
}

//Pour récupérer la taille (en tiles) de la carte
Map.prototype.getWidth = function() {
	return this.width;
}
Map.prototype.getLargeur = function() {
    return this.terrain[0].length;
}
Map.prototype.fill = function(){
	var colors = new Array();
	for(var i = 0; i < this.bulles.length; i++){
    	colors.push(this.bulles[i].getColor());
    }
	colors = shuffle(colors);
	for(var i = 0; i < this.bulles.length; i++){
    	this.bulles[i].setColor(colors[i]);
    }
    this.play = false;
	for(var i = 0; i < this.bulles.length; i++){
    	if(this.bulles[i].hasNeighbor()){
    		this.play = true;
    	}
    }
}
// Pour dessiner la carte
Map.prototype.dessinerMap = function(context) {
	//console.log('Dessin des ' + this.bulles.length + ' bulles');
    for(var i = 0; i < this.bulles.length; i++){
    	this.bulles[i].dessinerBulle(context);
    }
    document.getElementById('score').innerHTML = this.score;
    document.getElementById('multiplier').innerHTML = this.multiplier;
}
// Récupérer les coordonnées d'un clic sur la map
Map.prototype.clickCoord = function(x, y){
	return this.getBulle({x: Math.floor((x) / this.width), y: Math.floor((y) / this.width)});
}
// Pour ajouter un bulle
Map.prototype.addBulle = function(perso) {
    this.bulles.push(perso);
}
// Can play
Map.prototype.canPlay = function(){
	return this.play;
}
// Pour ajouter un bulle
Map.prototype.removeBulle = function(bulle) {
	if(bulle != null){
		var remove = 1;
		var coords = bulle.getCoords();
		var color = bulle.getColor();
		bulle.setCoords({x: coords.x, y: -1});
		bulle.setColor();
	    remove++;
	    var tmp = this.getBulle({x: coords.x, y: coords.y-1});// bottom
	    if(tmp != null && tmp.getColor() == color){
	    	remove += this.removeBulle(tmp); // bottom
	    }
	    var tmp = this.getBulle({x: coords.x, y: coords.y+1*1});// top
	    if(tmp != null && tmp.getColor() == color){
	    	remove += this.removeBulle(tmp); // top
	    }
	    var tmp = this.getBulle({x: coords.x+1*1, y: coords.y});// right
	    if(tmp != null && tmp.getColor() == color){
	    	remove += this.removeBulle(tmp); // right
	    }
	    var tmp = this.getBulle({x: coords.x-1, y: coords.y});// left
	    if(tmp != null && tmp.getColor() == color){
	    	remove += this.removeBulle(tmp); // left
	    }
	    return remove;
	}
	return 0;
}

Map.prototype.calcScore = function(nbRemove_){
	var plus = 0;
	if(nbRemove_ == 2){
		this.multiplier = 1;
	}else if(nbRemove_ > 2){
		this.multiplier++;
	}
	var bonus = 1;
	if(nbRemove_ > 5){
		bonus = 2;
	}
	if(nbRemove_ > 10){
		bonus = 4;
	}
	this.score += this.multiplier * nbRemove_ * bonus;
}

Map.prototype.getBulle = function(coords){
	for(var i = 0; i < this.bulles.length; i++){
    	if(this.bulles[i].isAtCoord(coords)){
    		return this.bulles[i];
    	}
    }
	return null;
}

Map.prototype.getBulleIndice = function(coords){
	//console.log('Search bulle at (' + coords.x + ', ' + coords.y + ')');
	for(var i = 0; i < this.bulles.length; i++){
		//console.log(this.bulles[i]);
    	if(this.bulles[i].isAtCoord(coords)){
    		//console.log('FOUND !! ');
    		return i;
    	}
    }
	return false;
	//console.log('NOT FOUND !! ');
}

function getXMLHttpRequest() {
    var xmlhttp = null;
    if (window.XMLHttpRequest || window.ActiveXObject) {
        if (window.ActiveXObject) {
            try {
                xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch(e) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    } else {
        xmlhttp = new XMLHttpRequest();
    }
    } else {
        alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
        return null;
    }
    return xmlhttp;
}

function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}
