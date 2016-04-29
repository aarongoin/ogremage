var initValue = require ('../../util/initValue'),
	Sensor = require('./sensor'),
	Mover = require('./mover');

var Mob = function(self, init) {

	this.self = self;
	self.ai = this;

	self.updates.push('ai');

	this.power = (init.power) ? initValue(init.power) : 1;

	this.target = null;

	return self;
};
Mob.prototype.update = function() {
	var detected = this.self.sensor.detected,
		i,
		dif;

	if (this.target && this.target.life <= 0) this.target = null;
	this._target = this.target;

	this.self.sensor.detect(this.self.race.dislike);

	i = detected.length;
	while (i--) {
		if (this.target) {
			dif = this.self.race.relations[this.target.type] - this.self.race.relations[detected[i].type];
			if (dif > 0) this.target = detected[i];
			else if (dif === 0) {
				if ((this.self.tile.distanceTo(this.target.tile) - this.self.tile.distanceTo(detected[i].tile)) > 0) this.target = detected[i];
			}
		} else this.target = detected[i];
	}

	if (this.target){
		if (this.self.tile.border.all.indexOf(this.target.tile) !== -1) {
			this.self.mover.path = [];
			if (this.canAttack()) this.attack(this.target);
		} else this.self.mover.moveTo(this.target.tile, (this.target === this._target));
	} else {
		detected = this.self.tile.border.open();
		if (detected.length) {
			i = (Math.random() * detected.length) >> 0;
			this.self.mover.moveTo(detected[i]);
		}
	}

};
Mob.prototype.canAttack = function() {
	return this.self.mover.canMove();
};
Mob.prototype.attack = function(entity) {
	entity.loseLife(this.power);
};

module.exports = Mob;