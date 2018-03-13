class Unit {
	constructor(unitName, unitType, unitSize, description, cost, date, time) {
		this.unitName = unitName;
		this.unitType = unitType;
		this.unitSize = unitSize;
		this.description = description;
		this.cost = cost;
		this.date = date;
		this.time = time;
	}
}

module.exports = Unit;