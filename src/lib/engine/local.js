var Viewport = require('./viewport'),
	HUD = require('./hud'),
	World = require('./world/world'),
	LocalMap = require('./map'),
	Player = require('./player'),
	Clock = require('./clock'),
	Animation = require('./fx/animation'),
	Dispatch = require('../util/dispatch'),
	Entity = require('./entity/entity'),
	DrawBuffer = require('../util/drawBuffer');

var Local = function(ENGINE, BP, callback){

	this.ENGINE = ENGINE;

	this.drawSpace = new DrawBuffer();

	//this.HUD = new HUD();

	this.BP = BP;

	this.WORLD = new World(BP);

	this.CLOCK = new Clock(1);

	this.onExit = this.onExit.bind(this);

	this.load(this.WORLD.current, 0.3, BP.start.x, BP.start.y);

	Dispatch.on('death', this.onDeath.bind(this));

	callback();
};

Local.prototype.drawBuffer = function(buffer, w, h) {
	this.drawSpace.setBuffer(buffer, w, h);
	Viewport.checkDims(w, h);
	//this.HUD.checkDims(w, h);
};

Local.prototype.onDeath = function(deadEntity) {
	deadEntity = deadEntity.detail;
	if (deadEntity.isPC) {
		this.CLOCK.speed = 8;
		this.PLAYER.light.isOn = false;
	} else if (deadEntity.race) {
		deadEntity.race.territory[this.WORLD.current.id].population--;
	}
};

Local.prototype.onExit = function(mob, exit) {
	var area = exit.to,
		target = area.exits[exit.eID];

	if (mob.isPC) this.load(area, 0.3,  target.x, target.y);
	//else this.WORLD.migrate(mob, area);
};

Local.prototype.load = function(area, time, px, py) {

	this.CLOCK.speed = 0;

	// TODO - optional transition screen here, else default to: loading...

	this.MAP = new LocalMap(this, area);
	
	//this.LIGHTS = new LightMaker(CONSOLE),

	Viewport.useMap(this.MAP);

	this.PLAYER = new Player(this.BP.player, this.CLOCK, Viewport);

	this.PLAYER.place( this.MAP.data[px][py] );

	Entity.globalList = [this.PLAYER];

	this.mobs = this.WORLD.mobsForArea(area); // all non-player entities--friendly or otherwise
	
	this.spawn();

	this.CLOCK.resetTo(time);

	this.t1Double = this.PLAYER.t1Tap.bind(this.PLAYER);

};

Local.prototype.onT1Double;

Local.prototype.spawn = function() {
	var i,
		x,
		y,
		t;

	i = this.mobs.length;
	while (i--) {
		x = Math.random() * (this.MAP.width - 1) >> 0;
		y = Math.random() * (this.MAP.height - 1) >> 0;

		t = this.MAP.data[x][y];

		if (t.isWall || !this.mobs[i].place(t)) i++;
	}
};

Local.prototype.update = function(dt) {
	var i;

	if (this.CLOCK.tick(dt)) {
		
		this.PLAYER.update(this.CLOCK.energy);

		this.WORLD.update(this.CLOCK.dt);

		i = this.mobs.length;
		while (i--) this.mobs[i].update(this.CLOCK.energy);

		//this.PLAYER.light.update();
		
		Animation.updateGlobal(this.CLOCK.dt);

		if (!this.drawSpace.afk()) {
			Viewport.draw();
			this.ENGINE.draw(this.drawSpace.buffer);
		}
	}
};

module.exports = Local;