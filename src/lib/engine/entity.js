var idCount = -1
	entityList = [];

var Entity = function(init) {
	var components = [];

	this.id = ++idCount;
	entityList.push(this);
	
	this.addComponent = _addComponent.bind(components);
	this.removeComponent = _removeComponent.bind(components);
	this.hasComponent = _hasComponent.bind(components);

	if (init) {
		for (var i in init) {
			this.addComponent(i);
		}
	}

	return this;
};

function _hasComponent(name) {
	return (this[name] !== undefined);
}
function _addComponent(component) {
	this[component.key] = component;
}
function _removeComponent(component) {
	if (this[component.key]) this[component.key] = undefined;
}
function _id() {
	return this;
}

module.exports = {
	Entity: Entity,
	all: entityList
};