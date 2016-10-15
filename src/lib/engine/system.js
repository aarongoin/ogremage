var Entities = require('./entity');

var systemList = [];

var System = function(system, components) {

	this.entities = [];
	this.callback = system;

	if (components) this.components = components;
	
};
System.protoype.update = function(dt) {
	if (this.components) {
		if (this.entities.length) this.callback(this.entities);
		else return;
	}
	else this.callback();
};
System.prototype.removeEntity = function(entity) {
	var i = this.entities.indexOf(entity);
	if (i !== -1) this.entities.splice(i, 1);
}
System.prototype.addEntity = function(entity) {
	if (this.entities.indexOf(entity) === -1) {
		this.entities.push(entity);
	}
}
System.prototype.checkEntity = function(entity) {
	if (this.components) {
		for (var c in this) {
			if (entity.hasComponent(c)) continue;
			else return false;
		}
		return true;
	} 
	else return false;
};

function _addSystem(system, components) {
	systemList.push(new System(system, components));
}

function _assignEntity(entity) {
	for (var system in systemList) {
		if (system.checkEntity) system.addEntity(entity);
	}
};
function _deleteEntity(entity) {
	for (var system in systemList) {
		system.removeEntity(entity);
	}
};

module.exports = {
	addSystem: _addSystem,
	assignEntity: _assignEntity,
	deleteEntity: _deleteEntity,
	all: systemList
};