var initValue = require ('../../util/initValue'),
	Entity = require('./entity');

var Sensor = function(self, init) {
	init = init || {};
	
	this.self = self;
	self.sensor = this;

	self.updates.push('sensor');

	this.see = (init.see) ? initValue(init.see) : 0;
	this.hear = (init.hear) ? initValue(init.hear) : 0;
	this.smell = (init.smell) ? initValue(init.smell) : 0;

	this.heard = [];
	this.detected = [];

	this.checkTile = this.checkTile.bind(this);
	this.detect = this.detect.bind(this);

	return self;
};
Sensor.prototype.update = function() {
	this.heard = [];
	this.detected = [];
};
Sensor.prototype.canSee = function(entity) {
	if (this.self.tile.distanceTo(entity.tile) <= this.see) {
		return this.self.tile.traceTo(entity.tile, this.checkTile);
	} else return false;
};
Sensor.prototype.canHear = function(sound) {
	if (sound.volume/Math.pow(this.self.tile.distanceTo(sound.tile), 2) > this.hear) {
		this.heard.push(sound.entity);
		return true;
	} else return false;
};
Sensor.prototype.canSmell = function(entity) {
	return false; // TODO (this.self.tile.smellsLike(entity) > this.smell);
};
Sensor.prototype.detect = function(entity) {
	var i;
	
	entity = (entity.length || entity.length === 0) ? entity : [entity];

	i = entity.length;
	while (i--) {
		if ( (this.see && this.canSee(entity[i])) || (this.smell && this.canSmell(entity[i])) || (this.hear && this.heard.indexOf(entity[i])) ) {
			this.detected.push(entity[i]);
		}
	}
};
Sensor.prototype.checkTile = function(tile) {
	return (tile.isWall) ? false : null;
};

module.exports = Sensor;