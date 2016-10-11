var Viewport = require('./viewport'),
	HUD = require('./hud'),
	World = require('./world/world'),
	LocalMap = require('./map'),
	Player = require('./player'),
	Clock = require('./clock'),
	LightUpdate = (require('./fx/light')).update,
	Animation = require('./fx/animation'),
	Dispatch = (require('../util/dispatch')).Central,
	Entity = require('./entity/entity'),
	DrawBuffer = require('../util/drawBuffer');

var Local = function(BP, drawFunc, callback){

	this.draw = drawFunc;

	this.drawSpace = new DrawBuffer();

	//this.HUD = new HUD();

	// Save the blueprint file
	this.BP = BP;

	// World simulates game races in all areas
	this.WORLD = new World(BP);

	// Create new game clock moving at 1x speed
	// Clock governs passage of game time
	this.CLOCK = new Clock(1);

	this.onExit = this.onExit.bind(this);

	// Load starting area
	this.load(this.WORLD.current, 0.3, BP.start.x, BP.start.y);

	// Dispatcher for any mob or player death events
	Dispatch.on('death', this.onDeath.bind(this));

	// Start the Engine!
	callback();
};

Local.prototype.onResize = function(w, h) {
	Viewport.checkDims(w, h);
}

Local.prototype.drawBuffer = function(buffer, w, h) {
	this.drawSpace.setBuffer(buffer, w, h);
	Viewport.checkDims(w, h);
	//this.HUD.checkDims(w, h);
};

Local.prototype.onDeath = function(deadEntity) {
	deadEntity = deadEntity;
	if (deadEntity.isPC) {
		this.CLOCK.speed = 8;
		this.PLAYER.light.isOn = false;
	} else if (deadEntity.race) {
		deadEntity.race.territory[this.WORLD.current.id].population--;
		this.mobs.splice(this.mobs.indexOf(deadEntity), 1);
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

// Update game
Local.prototype.update = function(dt) {
	var i;

	if (this.CLOCK.tick(dt)) {
		
		this.PLAYER.update(this.CLOCK.energy);

		this.WORLD.update(this.CLOCK.dt);

		i = this.mobs.length;
		while (i--) this.mobs[i].update(this.CLOCK.energy);

		LightUpdate();
		
		Animation.updateGlobal(this.CLOCK.dt);

		if (!this.drawSpace.afk()) {
			Viewport.draw(this.drawSpace);
			this.draw(this.drawSpace.buffer);
		}
	}
};

module.exports = Local;