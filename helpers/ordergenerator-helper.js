const moment = require('moment');
const DeploymentUnit = require('../models/deploymentunit');
const Unit = require('../models/unit');
const Firebase = require('../config/database');
const deploymentUnitRef = Firebase.database().ref('DeploymentUnit');
const unitRef = Firebase.database().ref('Unit');

exports.createUnit = (req, res) => {
	const unitName = req.body.unit_name;
	const unitType = req.body.unit_type.toUpperCase();
	const unitSize = Number(req.body.unit_size);
	const description = req.body.description;
	const cost = Number(req.body.cost);
	const date = moment().format('DD/MM/YYYY');
	const time = moment().format('HH:mm:ss');

	unitRef.child(unitName)
		.once('value', snapshot => {
			if (snapshot.exists()) {
				return res.json({
					success: false,
					message: 'Unit already exists'
				});
			}

			const unit = new Unit(unitName, unitType, unitSize, description, cost, date, time);

			unitRef.child(unitName)
				.set(unit)
				.then(() => res.json({
					success: true,
					message: 'Unit Added Successfully'
				}))
				.catch(err => res.json({
					success: false,
					message: 'Unit Added Failed'
				}));
		});
};

exports.editUnit = (req, res) => {
	const unitName = req.params.unit_name;
	const unitType = req.body.unit_type.toUpperCase();
	const unitSize = Number(req.body.unit_size);
	const description = req.body.description;
	const cost = Number(req.body.cost);
	const date = moment().format('DD/MM/YYYY');
	const time = moment().format('HH:mm:ss');

	unitRef.child(unitName)
		.once('value', snapshot => {
			if (!snapshot.exists()) {
				return res.json({
					success: false,
					message: 'Invalid unit name'
				});
			}

			const unit = new Unit(unitName, unitType, unitSize, description, cost, date, time);

			unitRef.child(unitName)
				.update(unit)
				.then(() => res.json({
					success: true,
					message: 'Unit Updated Successfully'
				}))
				.catch(err => res.json({
					success: false,
					message: 'Unit Updated Failed'
				}));
		});
};

exports.deleteUnit = (req, res) => {
	const unitName = req.params.unit_name;	

	unitRef.child(unitName)
		.once('value', snapshot => {
			if (snapshot.exists()) {
				unitRef.child(unitName)
					.remove()
					.then(() => res.json({
						success: true,
						message: 'Unit Deleted Successfully'
					}))
					.catch(err => res.json({
						success: false,
						message: 'Unit Deleted Failed'
					}));
			} else {
				return res.json({
					success: false,
					message: 'Invalid unit name'
				});	
			}
		});
};

exports.reduceUnitSize = (req, res) => {
	const unitName = req.params.unit_name;
	const number = Number(req.body.number);

	unitRef.child(unitName)
		.once('value', snapshot => {
			if (snapshot.exists()) {
				snapshot.forEach(childSnapshot => {
					if (childSnapshot.key === 'unitSize') {
						const totalSize = {
							'date': moment().format('DD/MM/YYYY'),
							'time': moment().format('HH:mm:ss'),
							'unitSize': Number(childSnapshot.val()) - number
						};

						if (totalSize['unitSize'] < 0) {
							return res.json({
								success: false,
								message: 'Reduce No cannot be more than unit size'
							});
						} else {
							unitRef.child(unitName)
								.update(totalSize)
								.then(() => res.json({
									success: true,
									message: 'Reduce Unit Size Successfully'
								}))
								.catch(err => res.sjon({
									success: false,
									message: 'Reduce Unit Size Failed'
								}));
						}
					}
				});
			} else {
				return res.json({
					success: false,
					message: 'Invalid unit name'
				});
			}
		});
};

exports.increaseUnitSize = (req, res) => {
	const unitName = req.params.unit_name;
	const number = Number(req.body.number);

	unitRef.child(unitName)
		.once('value', snapshot => {
			if (snapshot.exists()) {
				snapshot.forEach(childSnapshot => {
					if (childSnapshot.key === 'unitSize') {
						const totalSize = {
							'date': moment().format('DD/MM/YYYY'),
							'time': moment().format('HH:mm:ss'),
							'unitSize': Number(childSnapshot.val()) + number
						};

						unitRef.child(unitName)
							.update(totalSize)
							.then(() => res.json({
								success: true,
								message: 'Increase Unit Size Successfully'
							}))
							.catch(err => res.sjon({
								success: false,
								message: 'Increase Unit Size Failed'
							}));						
					}
				});
			} else {
				return res.json({
					success: false,
					message: 'Invalid unit name'
				});
			}
		});
};

exports.createDeploymentUnit = (req, res) => {
	const unitName = req.body.unit_name;
	const unitType = req.body.unit_type.toUpperCase();
	const currentUnitSize = Number(req.body.current_unit_size);
	const unitCasualty = 0;
	const coordinateX = Number(req.body.coordinate_x);
	const coordinateY = Number(req.body.coordinate_y);
	const unitStatus = req.body.unit_status.toUpperCase();
	const date = moment().format('DD/MM/YYYY');
	const time = moment().format('HH:mm:ss');

	deploymentUnitRef.child(unitName)
		.once('value', snapshot => {
			// Check unit name
			if (snapshot.exists()) {
				return res.json({
					success: false,
					message: 'Deployment unit already exists'
				});
			}

			// Check unit size
			unitRef.child(unitName)
				.once('value', unitSnapshot => {
					if (unitSnapshot.exists()) {
						unitSnapshot.forEach(childUnitSnapshot => {
							if (childUnitSnapshot.key === 'unitSize') {
								const totalSize = {
									'date': date,
									'time': time,
									'unitSize': childUnitSnapshot.val() - currentUnitSize
								};

								// Compare unit size and deployment unit size
								if (totalSize['unitSize'] < 0) {
									return res.json({
										success: false,
										message: 'Deployment unit size cannot be more than unit size'
									});
								} else {
									const deploymentUnit = new DeploymentUnit(unitName, unitType, currentUnitSize, unitCasualty, coordinateX, coordinateY, unitStatus, date, time);

									// Add deployment unit to firebase
									deploymentUnitRef.child(unitName)
										.set(deploymentUnit)
										.then(() => {
											// Update unit size to firebase
											unitRef.child(unitName)
												.update(totalSize)
												.then(() => res.json({
													success: true,
													message: 'Deployment Unit Added Successfully'
												}))
												.catch(err => res.json({
													success: false,
													message: 'Unit Size Updated Failed'
												}));												
										})
										.catch(err => res.json({
											success: false,
											message: 'Deployment Unit Added Failed'
										}));
								}
							}
						});						
					} else {
						return res.json({
							success: false,
							message: 'Unit name does not exists'
						})
					}
				});			
		});
};

exports.editDeploymentUnit = (req, res) => {
	const unitName = req.params.unit_name;
	const unitType = req.body.unit_type.toUpperCase();
	const currentUnitSize = Number(req.body.current_unit_size);
	const unitCasualty = Number(req.body.unit_casualty);
	const coordinateX = Number(req.body.coordinate_x);
	const coordinateY = Number(req.body.coordinate_y);
	const unitStatus = req.body.unit_status.toUpperCase();
	const date = moment().format('DD/MM/YYYY');
	const time = moment().format('HH:mm:ss');

	deploymentUnitRef.child(unitName)
		.once('value', snapshot => {
			// Check unit name
			if (!snapshot.exists()) {
				return res.json({
					success: false,
					message: 'Invalid unit name'
				});
			}

			// Check unit size
			unitRef.child(unitName)
				.once('value', unitSnapshot => {
					if (unitSnapshot.exists()) {
						unitSnapshot.forEach(childUnitSnapshot => {
							if (childUnitSnapshot.key === 'unitSize') {
								const totalSize = {
									'date': date,
									'time': time,
									'unitSize': childUnitSnapshot.val() - currentUnitSize
								};

								// Compare unit size and deployment unit size
								if (totalSize['unitSize'] < 0) {
									return res.json({
										success: false,
										message: 'Deployment unit size cannot be more than unit size'
									});
								} else {
									const deploymentUnit = new DeploymentUnit(unitName, unitType, currentUnitSize, unitCasualty, coordinateX, coordinateY, unitStatus, date, time);

									// Add deployment unit to firebase
									deploymentUnitRef.child(unitName)
										.update(deploymentUnit)
										.then(() => {
											// Update unit size to firebase
											unitRef.child(unitName)
												.update(totalSize)
												.then(() => res.json({
													success: true,
													message: 'Deployment Unit Updated Successfully'
												}))
												.catch(err => res.json({
													success: false,
													message: 'Unit Size Updated Failed'
												}));												
										})
										.catch(err => res.json({
											success: false,
											message: 'Deployment Unit Updated Failed'
										}));
								}
							}
						});						
					} else {
						return res.json({
							success: false,
							message: 'Unit name does not exists'
						})
					}
				});			
		});
};

exports.deleteDeploymentUnit = (req, res) => {
	const unitName = req.params.unit_name;	

	// Check unit name
	deploymentUnitRef.child(unitName)
		.once('value', deploymentUnitSnapshot => {
			if (deploymentUnitSnapshot.exists()) {
				let totalSize = {
					'date': moment().format('DD/MM/YYYY'),
					'time': moment().format('HH:mm:ss'),
					'unitSize': 0
				};

				// Add currntUnitSize and unitCasualty
				deploymentUnitSnapshot.forEach(childDeploymentUnitSnapshot => {					
					if (childDeploymentUnitSnapshot.key === 'currentUnitSize') {
						totalSize['unitSize'] += childDeploymentUnitSnapshot.val();
					}
				});

				// Remove deployment unit
				deploymentUnitRef.child(unitName)
					.remove()
					.then(() => {
						unitRef.child(unitName)
							.once('value', unitSnapshot => {
								// Add unit size
								if (unitSnapshot.exists()) {
									unitSnapshot.forEach(childUnitSnapshot => {
										if (childUnitSnapshot.key === 'unitSize') {
											totalSize['unitSize'] += childUnitSnapshot.val();
										}
									});

									// Update unit size
									unitRef.child(unitName)
										.update(totalSize)
										.then(() => res.json({
											success: true,
											message: 'Deployment Unit Deleted Successfully'
										}))
										.catch(err => res.json({
											success: false,
											message: 'Unit Size Updated Failed'
										}))
								} else {
									return res.json({
										success: false,
										message: 'Unit name does not exists'
									})
								}
							});						
					})
					.catch(err => res.json({
						success: false,
						message: 'Deployment Unit Deleted Failed'
					}));
			} else {
				return res.json({
					success: false,
					message: 'Invalid unit name'
				});	
			}
		});
};

exports.increaseDeploymentUnitSize = (req, res) => {
	const unitName = req.params.unit_name;
	const number = Number(req.body.number);
	const date = moment().format('DD/MM/YYYY');
	const time = moment().format('HH:mm:ss');

	deploymentUnitRef.child(unitName)
		.once('value', deploymentUnitSnapshot => {
			// Check deployment unit name
			if (!deploymentUnitSnapshot.exists()) {
				return res.json({
					success: false,
					message: 'Invalid unit name'
				});
			}

			// Get current deployment unit size 
			deploymentUnitSnapshot.forEach(childDeploymentUnitSnapshot => {
				if (childDeploymentUnitSnapshot.key === 'currentUnitSize') {
					const deploymentTotalSize = {
						'date': date,
						'time': time,
						'currentUnitSize': childDeploymentUnitSnapshot.val() + number
					}

					// Check unit name
					unitRef.child(unitName)
						.once('value', unitSnapshot => {
							if (unitSnapshot.exists()) {
								// Get unit size - number
								unitSnapshot.forEach(childUnitSnapshot => {
									if (childUnitSnapshot.key === 'unitSize') {
										const totalSize = {
											'date': date,
											'time': time,
											'unitSize': childUnitSnapshot.val() - number
										};

										// Compare unit size and deployment unit size
										if (totalSize['unitSize'] < 0) {
											return res.json({
												success: false,
												message: 'Deployment unit size cannot be more than unit size'
											});
										} else {	
											// Update deployment unit size to firebase
											deploymentUnitRef.child(unitName)
												.update(deploymentTotalSize)
												.then(() => {
													// Update unit size to firebase
													unitRef.child(unitName)
														.update(totalSize)
														.then(() => res.json({
															success: true,
															message: 'Deployment Unit Updated Successfully'
														}))
														.catch(err => res.json({
															success: false,
															message: 'Unit Size Updated Failed'
														}));												
												})
												.catch(err => res.json({
													success: false,
													message: 'Deployment Unit Updated Failed'
												}));
										}
									}	
								});		
							} else {
								return res.json({
									success: false,
									message: 'Unit name does not exists'
								})
							}
						});
				}	
			});
		});
};

exports.increaseDeploymentUnitCasualty = (req, res) => {
	const unitName = req.params.unit_name;
	const number = Number(req.body.number);
	const date = moment().format('DD/MM/YYYY');
	const time = moment().format('HH:mm:ss');

	deploymentUnitRef.child(unitName)
		.once('value', deploymentUnitSnapshot => {
			// Check deployment unit name
			if (!deploymentUnitSnapshot.exists()) {
				return res.json({
					success: false,
					message: 'Invalid unit name'
				});
			}

			const deploymentCasualty = {
				'date': date,
				'time': time
			}

			// Get current deployment unit casualtiy 
			deploymentUnitSnapshot.forEach(childDeploymentUnitSnapshot => {
				if (childDeploymentUnitSnapshot.key === 'unitCasualty') {
					deploymentCasualty['unitCasualty'] = childDeploymentUnitSnapshot.val() + number;
				} else if (childDeploymentUnitSnapshot.key === 'currentUnitSize') {
					deploymentCasualty['currentUnitSize'] = childDeploymentUnitSnapshot.val() - number;
				}
			});

			// Update deployment unit casualty to firebase
			deploymentUnitRef.child(unitName)
				.update(deploymentCasualty)
				.then(() => res.json({
					success: true,
					message: 'Deployment Unit Updated Successfully'
				}))
				.catch(err => res.json({
					success: false,
					message: 'Deployment Unit Updated Failed'
				}));
		});
};

exports.updateDeploymentUnitStatus = (req, res) => {
	const unitName = req.params.unit_name;
	const unitStatus = req.body.unit_status.toUpperCase();
	const date = moment().format('DD/MM/YYYY');
	const time = moment().format('HH:mm:ss');

	// Check unit name
	deploymentUnitRef.child(unitName)
		.once('value', deploymentUnitSnapshot => {
			if (deploymentUnitSnapshot.exists()) {
				const updateUnitStatus = {
					unitName,
					unitStatus,
					date,
					time
				};

				// Update deployment unit status to firebase
				deploymentUnitRef.child(unitName)
					.update(updateUnitStatus)
					.then(() => res.json({
						success: true,
						message: 'Deployment Unit Updated Successfully'
					}))
					.catch(err => res.json({
						success: false,
						message: 'Deployment Unit Updated Failed'
					}));
			} else {
				return res.json({
					success: false,
					message: 'Invalid unit name'
				});
			}
		});
};