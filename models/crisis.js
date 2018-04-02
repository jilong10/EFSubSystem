class Crisis {
	constructor(crisisCode, noOfInjuries, noOfDeaths, landTroops, seaTroops, airTroops, quarantineTroops, cleanupTroops, budget, missionType, date, time) {
		this.crisisCode = crisisCode;
		this.noOfInjuries = noOfInjuries;
		this.noOfDeaths = noOfDeaths;
		this.landTroops = landTroops;
		this.seaTroops = seaTroops;
		this.airTroops = airTroops;
		this.quarantineTroops = quarantineTroops;
		this.cleanupTroops = cleanupTroops;
		this.budget = budget;
		this.missionType = missionType;
		this.date = date;
		this.time = time;
	}
}

module.exports = Crisis;