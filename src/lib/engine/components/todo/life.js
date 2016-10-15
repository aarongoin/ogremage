var initValue = require('../../util/initValue'),
	Dispatch = require('../../util/dispatch'),
	Color = require('../../util/color'),
	Particle = require('../fx/particle');

// Any "thing" that can be on the map -- mob, furniture, doors
var Life = function(self, init) {
	if (init) this.init(init);

	return this;
};
Life.prototype.init = function(init) {

	Life.globalList.push(this);

	this.tile = null;

	if (init.name) this.name = init.name;

	this.life = (init.life) ? initValue(init.life) : 10; // power to exist
	this.energy = 0; // power to act and move

	this.odor = (init.odor) ? initValue(init.odor) : 1;

	this.states = init.states || {
		"active": {c: 1, f: '#ffff00'},
		"damage":  {c: 1, f: '#b21f35'},
		"dead": {c: 1, f: '#333333'}
	};

	this.state = (typeof init.state === 'string') ? init.states[init.state] : this.states["active"];

	this.lit = new Color(this.state.f);

	this.damageIndicator = { pos: null, acc: null, draw: {c: null, f: null} }; // not used???
};
Life.prototype.update = function(energy) {
	var i;

	//if (this.state !== this.states.dead && this.odor) this.tile.space.scents[this.id] += this.odor;

	if (this.state === this.states.active || this.state === this.states.takingDamage) {
		this.energy += energy;

		i = -1;
		while (++i < this.updates.length) this[ this.updates[i] ].update();
	}
};
Life.prototype.loseLife = function(amount) {
	this.life -= amount;
	Particle.emit({ pos: [this.tile.x, this.tile.y], acc: [0, 1], draw: null }); // wierd?
	if (this.life <= 0) {
		this.die();
		return true;
	}
	this.state = this.states.takingDamage;
	this.lit.beHex(this.state.f);
	setTimeout(function(){
		if (this.state !== this.states.dead) {
			this.state = this.states.active;
			this.lit.beHex(this.state.f);
		}
	}.bind(this), 200);
	return false;
};
Life.prototype.die = function() {
	this.life = 0;
	this.state = this.states.dead;
	this.lit.beHex(this.state.f);
	this.tile.leave(this);
	Life.globalList.splice(Life.globalList.indexOf(this), 1);
	Dispatch('death', this);
};

Life.idCount = 0;
Life.globalList = [];

module.exports = Life;