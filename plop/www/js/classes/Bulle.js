var DIRECTION = {
    "BAS"    : 0,
    "GAUCHE" : 1,
    "DROITE" : 2,
    "HAUT"   : 3
};
var COLORS = ['green', 'blue', 'red', 'pink', 'yellow', 'cyan', 'gray'];
var DUREE_ANIMATION = 2;
var DUREE_DEPLACEMENT = 4;

function Bulle(x, y, map, color) {
    this.x = x; // (en cases)
    this.y = y; // (en cases)
    
    this.map = map;
    
    this.etatAnimation = -1;
    
    if(color){
    	this.color = color;
    }else{
    	var indice = Math.floor((Math.random() * 7));
    	this.color = COLORS[indice];
    }
    //console.log(indice + '=>' + this.color);
    
    this.direction = 0;
}

Bulle.prototype.dessinerBulle = function(context) {
	var decalageX = 0, decalageY = 0; // Décalage à appliquer à la position du personnage
	var draw = true;
	
	if(this.etatAnimation >= DUREE_DEPLACEMENT) {
	    // Si le déplacement a atteint ou dépassé le temps nécessaire pour s'effectuer, on le termine
	    this.etatAnimation = -1;
	    this.map.unanimate();
	} else if(this.etatAnimation >= 0) {
		// Nombre de pixels restant à parcourir entre les deux cases
	    var pixelsAParcourir = this.map.getWidth() - (this.map.getWidth() * (this.etatAnimation / DUREE_DEPLACEMENT));
	    
	    // À partir de ce nombre, on définit le décalage en x et y.
	    // NOTE : Si vous connaissez une manière plus élégante que ces quatre conditions, je suis preneur
	    if(this.direction == DIRECTION.HAUT) {
	        decalageY = pixelsAParcourir;
	    } else if(this.direction == DIRECTION.BAS) {
	        decalageY = -pixelsAParcourir;
	    } else if(this.direction == DIRECTION.GAUCHE) {
	        decalageX = pixelsAParcourir;
	    } else if(this.direction == DIRECTION.DROITE) {
	        decalageX = -pixelsAParcourir;
	    }
	    
	    this.etatAnimation++;
	}else{
		// Nombre de pixels restant à parcourir entre les deux cases
	    var pixelsAParcourir = this.map.getWidth() - (this.map.getWidth() * (1 / DUREE_DEPLACEMENT));
		// On vérifie que la case demandée est bien située dans la carte
	    var prochaineCase = this.getCoordonneesAdjacentes(DIRECTION.BAS);
	    if(prochaineCase.x >= 0 && prochaineCase.y >= 0 && prochaineCase.x < this.map.getLargeur() && prochaineCase.y < this.map.getHauteur()) {
	        var bulle = this.map.getBulle(prochaineCase);
	        if(bulle == false){
	        	this.deplacer(DIRECTION.BAS);
	        	decalageY = -pixelsAParcourir;
	        }
	    }
	}
	/*
	 * Si aucune des deux conditions n'est vraie, c'est qu'on est immobile, 
	 * donc il nous suffit de garder les valeurs 0 pour les variables 
	 * frame, decalageX et decalageY
	 */
	context.beginPath();
    context.arc(this.x * this.map.getWidth() + (this.map.getWidth()/2) + decalageX, this.y * this.map.getWidth() + (this.map.getWidth()/2) + decalageY, (this.map.getWidth()/2 - 3), 0, 2 * Math.PI, true);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
}

Bulle.prototype.getCoordonneesAdjacentes = function(direction)  {
    var coord = {'x' : this.x, 'y' : this.y};
    switch(direction) {
        case DIRECTION.BAS : 
            coord.y++;
            break;
        case DIRECTION.GAUCHE : 
            coord.x--;
            break;
        case DIRECTION.DROITE : 
            coord.x++;
            break;
        case DIRECTION.HAUT : 
            coord.y--;
            break;
    }
    return coord;
}

Bulle.prototype.hasNeighbor = function(){
	var bottom = this.map.getBulle({x: this.x, y: this.y-1});
    if(bottom != false && bottom.getColor() == this.getColor()){
    	return true;
    }
    var top =  this.map.getBulle({x: this.x, y: this.y+1});
    if(top != false && top.getColor() == this.getColor()){
    	return true;
    }
    var right = this.map.getBulle({x: this.x+1, y: this.y});
    if(right != false && right.getColor() == this.getColor()){
    	return true;
    }
    var left = this.map.getBulle({x: this.x-1, y: this.y});
    if(left != false && left.getColor() == this.getColor()){
    	return true;
    }
    
    return false;
}

//Récupérer les coordonnées d'un clic sur la map
Bulle.prototype.isAtCoord = function(coords){
	return this.x == coords.x && this.y == coords.y;
}
//Récupérer les coordonnées d'un clic sur la map
Bulle.prototype.getColor = function(){
	return this.color;
}
//Récupérer les coordonnées d'un clic sur la map
Bulle.prototype.setColor = function(color){
	this.color = color;
}
Bulle.prototype.deplacer = function(direction) {
	// On ne peut pas se déplacer si un mouvement est déjà en cours !
	if(this.etatAnimation >= 0) {
	    return false;
	}
	
    // On change la direction du personnage
    this.direction = direction;
        
    // On vérifie que la case demandée est bien située dans la carte
    var prochaineCase = this.getCoordonneesAdjacentes(direction);
    if(prochaineCase.x < 0 || prochaineCase.y < 0 || prochaineCase.x >= this.map.getLargeur() || prochaineCase.y >= this.map.getHauteur()) {
        // On retourne un booléen indiquant que le déplacement ne s'est pas fait, 
        // Ça ne coute pas cher et ca peut toujours servir
        return false;
    }
    
    // On commence l'animation
    this.etatAnimation = 1;
    
    this.map.animate();
    
    // On effectue le déplacement
    this.x = prochaineCase.x;
    this.y = prochaineCase.y;
        
    return true;
}