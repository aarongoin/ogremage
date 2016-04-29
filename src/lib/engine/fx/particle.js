var _i,
	_p,
	_instant = { x: null, y: null, t: null },
	_cache = [];

var Particle = function(init) {
	this.init(init);
};

Particle.prototype.update = function(dt) {

	t -= dt;
	if (t) {

		this.vel[0] += this.acc[0] * dt;
		this.vel[1] += this.acc[1] * dt;

		this.pos[0] += this.vel[0] * dt;
		this.pos[1] += this.vel[1] * dt;

	} else this.die();
};

Particle.prototype.die = function() {
	_cache.push(Particle.globalList.splice( Particle.globalList.indexOf(this), 1 ));
};

Particle.prototype.init = function(init) {

	Particle.globalList.push(this);

	this.pos = init.pos;
	this.vel = init.vel || [0, 0];
	this.acc = init.acc || [0, 0];
	this.t = init.t;

	this.draw = init.draw;
};

Particle.prototype.draw = function(dt, callback) {

	_instant.x = this.pos[0] >> 0;
	_instant.y = this.pos[1] >> 0;
	_instant.t = this.draw;

	return _instant;
};

Particle.emit = function(init) {

	if (_cache.length) return (_cache.pop()).init(init);
	else return new Particle(init);
};

Particle.globalList = [];

module.exports = Particle;