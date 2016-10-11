var initValue = require('../../util/initValue'),
	Dispatcher = require('../../util/dispatch'),
	Color = require('../../util/color'),
	Particle = require('../fx/particle');

// Any "thing" that can be on the map -- mob, furniture, doors
var Entity = function(self, init) {
	var self = (reuse.length) ? reuse(reuse.pop(), init) : {
		id: ++idCount,
		tile: null,
		updates: [],
		type: init.type,
		core: {
			draw: init.draw,
			size: init.size
		}
	};

	this.id = _id.bind(self);
	this.place = _place.bind(self);
	this.update = _updates.bind(self);
	this.add = _add.bind(self);
	this.remove = _remove.bind(self);

	this.dispatch = new Dispatcher();

	Entity.globalList.push(this);
	this.lit = new Color(self.core.draw.f);

	return this;
};
function _add(component) {
	this.updates.push(component);
};
function _remove(component) {
	this.updates.splice(this.updates.indexOf(component), 1);
}
function _place(tile) {
	if (this.tile) this.tile.leave();
	tile.occupy(this, true);
	this.tile = tile;
	return true;
};
function _update() {
	var i = -1;
	while (++i < this.updates.length) this.updates[i].update(this.core);
};
function _id(id) {
	return this.id;
};

var idCount = 0,
	globalList = [],
	_reuse = [],
	reuse = function(self, init) {
		self.tile = null;
		self.updates = [];
		self.type = init.type;
	};

module.exports = Entity;