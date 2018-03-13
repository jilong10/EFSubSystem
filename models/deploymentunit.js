class DeploymentUnit {
	constructor(unitName, unitType, currentUnitSize, unitCasualty, coordinateX, coordinateY, unitStatus, date, time) {
		this.unitName = unitName;
		this.unitType = unitType;
		this.currentUnitSize = currentUnitSize;
		this.unitCasualty = unitCasualty;
		this.coordinateX = coordinateX;
		this.coordinateY = coordinateY;
		this.unitStatus = unitStatus;
		this.date = date;
		this.time = time;
	}
}

module.exports = DeploymentUnit;