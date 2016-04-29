var initValue = require('../../util/initValue'),
	Dispatch = require('../../util/dispatch'),
	Color = require('../../util/color'),
	Particle = require('../fx/particle');

var Entity = function(self, init) {
	if (init) this.init(init);

	return this;
};
Entity.prototype.init = function(init) {

	this.id = ++Entity.idCount;
	Entity.globalList.push(this);

	this.tile = null;
	this.updates = [];

	this.type = init.type || "Human";
	this.name = init.name || "Bill";
	this.size = (init.size) ? initValue(init.size) : 0.9;

	this.life = (init.life) ? initValue(init.life) : 10; // power to exist
	this.energy = 0; // power to act and move

	this.odor = (init.odor) ? initValue(init.odor) : 1;

	this.states = init.states || {
		"active": {c: 1, f: '#ffff00'},
		"dead": {c: 1, f: '#333333'}
	};
	this.states.takingDamage = {c: this.states.active.c, f: '#b21f35'};
	if (typeof init.state === 'string') init.state = init.states[init.state];
	this.state = init.state || this.states["active"];

	this.lit = new Color(this.state.f);

	this.damageIndicator = { pos: null, acc: null, draw: {c: null, f: null} };
};
Entity.prototype.place = function(tile) {
	tile.occupy(this, true);
	this.tile = tile;
	this._tile = null;
	return true;
};
Entity.prototype.update = function(energy) {
	var i;

	//if (this.state !== this.states.dead && this.odor) this.tile.space.scents[this.id] += this.odor;

	if (this.state === this.states.active || this.state === this.states.takingDamage) {
		this.energy += energy;

		i = -1;
		while (++i < this.updates.length) this[ this.updates[i] ].update();
	}
};
Entity.prototype.loseLife = function(amount) {
	this.life -= amount;
	Particle.emit({ pos: [this.tile.x, this.tile.y], acc: [0, 1], draw: null });
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
Entity.prototype.die = function() {
	this.life = 0;
	this.state = this.states.dead;
	this.lit.beHex(this.state.f);
	this.tile.leave(this);
	Entity.globalList.splice(Entity.globalList.indexOf(this), 1);
	Dispatch(new CustomEvent('death', {detail: this }));
};

Entity.idCount = 0;
Entity.globalList = [];

module.exports = Entity;