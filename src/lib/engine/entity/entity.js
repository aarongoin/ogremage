var initValue = require('../../util/initValue'),
	Dispatch = (require('../../util/dispatch')).Central,
	Color = require('../../util/color'),
	Particle = require('../fx/particle');

// Any "thing" that can be on the map -- mob, furniture, doors
var Entity = function(self, init) {
	if (init) this.init(init);

	return this;
};
Entity.prototype.init = function(init) {

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
	if (!this.states.damage) this.states.damage = {c: this.states.active.c, f: '#b21f35'};
	this.state = (typeof init.state === 'string') ? init.states[init.state] : this.states["active"];

	this.damageIndicator = { pos: null, acc: null, draw: {c: null, f: null} }; // not used???
	this.id = ++Entity.idCount;
	Entity.globalList.push(this);

	this.tile = null;
	this.updates = [];

	this.type = init.type || "New Thang";
	this.size = (init.size) ? initValue(init.size) : 0.9;
	
	this.lit = new Color(this.state.f);

};
Entity.prototype.place = function(tile) {
	if (tile.isWall) return false;
	tile.occupy(this, true);
	this.tile = tile;
	this._tile = null;
	return true;
};
Entity.prototype.update = function(energy) {
	if (this.life) this.energy += energy;
	var i = -1;
	while (++i < this.updates.length) this[ this.updates[i] ].update();
};
Entity.prototype.loseLife = function(amount) {
	this.life -= amount;
	Particle.emit({ pos: [this.tile.x, this.tile.y], acc: [0, 1], draw: null });
	if (this.life <= 0) {
		this.die();
		return true;
	}
	this.state = this.states.damage;
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
	this.energy = 0;
	this.state = this.states.dead;
	this.lit.beHex(this.state.f);
	this.tile.leave(this);
	Entity.globalList.splice(Entity.globalList.indexOf(this), 1);
	Dispatch('death', this);
};

Entity.idCount = 0;
Entity.globalList = [];

module.exports = Entity;