class Enemy {
	constructor(enemyName, enemySize, enemyType, coordinateX, coordinateY, affectArea) {
		this.enemyName = enemyName;
		this.enemySize = enemySize;
		this.enemyType = enemyType;
		this.coordinateX = coordinateX;
		this.coordinateY = coordinateY;
		this.affectArea = affectArea;				
	}
}

module.exports = Enemy;