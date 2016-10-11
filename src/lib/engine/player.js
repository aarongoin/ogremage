var Mover = require('./entity/mover'),
	Entity = require('./entity/entity'),
	ShadowsList = require('./fx/shadows'),
	Light = (require('./fx/light')).Light,
	Animation = require('./fx/animation');

var Player = function(PC, clock, viewport) {

	this.init(PC);

	this.clock = clock;
	this.viewport = viewport;

	PC.onMove = this.viewport.update.bind(this.viewport);

	new Mover(this, PC);

	this.isPC = true;

	this.dumbMove = this.mover.move.bind(this.mover);
	this.dumbMoveTo = this.mover.moveTo.bind(this.mover);

	this.mover.move = this.playerMove;
	this.mover.moveTo = this.playerMoveTo;

	this.entityPlace = this.place;
	this.place = this.playerPlace;

	this.entityUpdate = this.update;
	this.update = this.playerUpdate;

	this.light = new Light(PC.light.color, PC.light.luminosity);
	this.sight = PC.sight || 10;

	this.canSee = this.canSee.bind(this);
	this.pcCanSeeId = 1;
	this.cantSee = new ShadowsList();

	this.tapAnimation = new Animation({
		duration: 1,
		repeat: 0,
		keys: {
			0: {d: 0.01},
			100: {d: 20}
		}
	});
};
Player.prototype = new Entity();

Player.prototype.t1Tap = function(gesture) {
	var that = this,
		tile = this.viewport.getMapTile(gesture.tileX, gesture.tileY);
	if (tile && (tile !== this.tile) && (!tile.isWall) && (tile.pcCanSee || this.viewport.fov === 'full')) {
		this.tapAnimation.play(0, (function(anim){
			this.light.drawOn(tile, anim.state.d);
		}).bind(this));
		this.mover.moveTo( tile );

	}
};
Player.prototype.playerMoveTo = function(tile) {
	if (!this.oldClockSpeed) this.oldClockSpeed = this.self.clock.speed;
	this.self.clock.speed = 8;
	this.self.dumbMoveTo(tile);
};
Player.prototype.playerMove = function(tile) {
	var t = this.self.tile;
	if ( this.self.dumbMove(tile) ) {

		if (!this.path.length) this.self.clock.speed = this.oldClockSpeed;
	}
};
Player.prototype.playerPlace = function(tile) {
	if ( this.entityPlace(tile) ) {
		this.viewport.update(this);
	}
};
Player.prototype.playerUpdate = function(energy){
	this.pcCanSeeId++;
	
	this.entityUpdate(energy);
	this.FOV();
	if (this.energy > 1.5) this.energy = 1.5;
};
Player.prototype.FOV = function() {
	this.cantSee.clear();

	this.tile.pcCanSee = this.pcCanSeeId;

	this.tile.ripple(this.sight, this.canSee);
};
Player.prototype.canSee = function(tile, dx, dy) {
	if ( this.cantSee.shadowCast(tile, dx, dy, Math.sqrt(dx * dx + dy * dy)) && (this.tile.distanceTo(tile) < this.sight) ) tile.pcCanSee = this.pcCanSeeId;
};

module.exports = Player;