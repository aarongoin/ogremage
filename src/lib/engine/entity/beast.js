var initValue = require ('../../util/initValue'),
	Sensor = require('./sensor'),
	Mover = require('./mover');

var Beast = function(self, init) {

	this.self = self;
	self.ai = this;

	self.updates.push('ai');

	this.friends = [];
	this.foes = [];
	this.loot = [];

	this.power = (init.power) ? initValue(init.power) : 1;

	this.confidence = (init.confidence) ? initValue(init.confidence) : 1;

	return self;
};
Beast.prototype.update = function() {
	var detected = this.self.sensor.detect;

	// detect friends and foes -- modifying confidence as it goes

};
Beast.prototype.attack = function(entity) {

};
Beast.prototype.flee = function(entity) {

};
Beast.prototype.attack = function(entity) {

};

module.exports = Beast;