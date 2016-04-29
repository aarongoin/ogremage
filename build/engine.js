(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Channel = require('./lib/util/channel'),
	Local = require('./lib/engine/local');

var ENGINE = {
		shouldRun: false,
		start: function(){},
		quit: function(){},
		update: function(){},
		loop: {
			last: null,
			start: Date.now(),
			dt: null
		}
	},
	GAME = new Channel(self);

	GAME.to('quit');
	GAME.to('save');

	GAME.from('init', function(copied, transfered) {


		ENGINE.LOCAL = new Local(ENGINE, copied, function(){
			ENGINE.shouldRun = true;
			ENGINE.start();
		});
	});

	GAME.from('input', function(gesture) {
		if (gesture.type === 't1Double') {
			ENGINE.LOCAL.t1Double(gesture);
		}
	});

	GAME.toFrom('draw', function(copied, transfered) {
		ENGINE.LOCAL.drawBuffer(transfered, copied.width, copied.height);
	});

ENGINE.start = function() {
	setTimeout(ENGINE.update, 0);
};

ENGINE.quit = function() {
	GAME.quit();
};

ENGINE.update = function() {
	ENGINE.loop.last = ENGINE.loop.start;
	ENGINE.loop.start = Date.now();
	ENGINE.loop.dt = ENGINE.loop.start - ENGINE.loop.last;

	ENGINE.LOCAL.update(ENGINE.loop.dt);

	if (ENGINE.shouldRun) setTimeout(ENGINE.update, (40 - (Date.now() - ENGINE.loop.start)));
	else ENGINE.quit();
};

ENGINE.draw = function(drawSpace) {
	GAME.draw({ transfer: drawSpace });
};
},{"./lib/engine/local":12,"./lib/util/channel":23}],2:[function(require,module,exports){
var Clock = function(speed, secondsPerMinute) {

	this.resetTo(speed, secondsPerMinute);
};
Clock.prototype.tick = function(milliseconds) {
	if (this.speed) {
		this.dt = milliseconds / 1000;

		this.energy = this.dt * this.speed;

		return true;
	}

	return false;
};
Clock.prototype.resetTo = function(speed, secondsPerMinute) {

	this.speed = speed;
	this.energy = 0;

	this.secondsPerMinute = secondsPerMinute;
};

module.exports = Clock;
},{}],3:[function(require,module,exports){
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
},{"../../util/color":24,"../../util/dispatch":25,"../../util/initValue":27,"../fx/particle":9}],4:[function(require,module,exports){
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
},{"../../util/initValue":27,"./mover":5,"./sensor":6}],5:[function(require,module,exports){
var initValue = require ('../../util/initValue'),
	PriorityQ = require('../../util/priorityq');

var Mover = function(self, init) {
	init = init || {};
	
	this.self = self;
	self.mover = this;

	self.updates.push('mover');

	this.speed = (init.speed) ? initValue(init.speed) : 1;
	this.costToMove = 1 / this.speed;

	this.path = [];

	this.onMove = init.onMove || null;

	this.checkTile = this.checkTile.bind(this);

	return self;
};
Mover.prototype.canMove = function() {
	return (this.self.energy / this.costToMove) >> 0;
};
Mover.prototype.moveTo = function(tile, updateOnly) {
	if (this.self.tile !== tile) {
		if (!updateOnly) {
			if (!this.self.tile.traceTo(tile, this.checkTile)) this.pathfindToCorners(tile);
			else this.path = [tile];
		} else {
			if (this.path.length > 1 && this.path[1].traceTo(tile, this.checkTile)) this.path[0] = tile;
			else if (this.path.length === 1) this.path[0] = tile;
			else this.pathfindToCorners(tile);
		}
	}
};
Mover.prototype.move = function(tile) {

	if (this.path[this.path.length - 1] === tile) this.path.pop();

	tile.occupy(this.self);
	this.self._tile = this.self.tile;
	this.self.tile.leave(this.self);
	this.self.tile = tile;

	this.self.energy -= this.costToMove;

	if (this.onMove) this.onMove(this.self);

	return true;
};
Mover.prototype.update = function() {
	var open;
	while (this.canMove() && this.path.length) {
		open = this.self.tile.border.open();
		if (open.length) this.move( this.chooseClosestTileTo(this.path[this.path.length - 1], open) );
		else break;
	}
};

Mover.prototype.chooseClosestTileTo = function(tile, array) {

	if (array.length) this._check = array.shift();
	else return null;

	while (array.length) {
		if (tile.distanceTo(this._check) < tile.distanceTo(array[0])) array.shift();
		else this._check = array.shift();
	}

	return this._check;
};
Mover.prototype.pathfindToTile = function(tile) {
	var border,
		current = this.self.tile,
		frontier = new PriorityQ(),
		cameFrom = {},
		costSoFar = {},
		next,
		priority,
		c, i,
		newCost;

	cameFrom[current.id] = null;
	costSoFar[current.id] = 0;

	this.path = [];

	frontier.add(current, 0);
	while (frontier.data.length) {

		current = frontier.remove();

		if (current === tile) {
			break;
		}

		border = current.border.open();
		i = border.length;
		while (i--) {
			next = border[i];

			newCost = costSoFar[current.id] + current.distanceTo(next);

			if ((costSoFar[next.id] !== 0 && !costSoFar[next.id]) || (newCost < costSoFar[next.id])) {

				costSoFar[next.id] = newCost;
				priority = newCost + next.distanceTo(tile);

				frontier.add(next, priority);
				cameFrom[next.id] = current;
			}
		}
	}

	// retrace our steps
	this.path.push(current);
	next = tile;
	while (next = cameFrom[next.id]) if (next !== this.self.tile) this.path.push(next);

};

Mover.prototype.pathfindToCorners = function(tile) {
	var goal = tile.getClosestCorner(),
		current = this.self.tile.getClosestCorner(),
		frontier = new PriorityQ(),
		cameFrom = {},
		costSoFar = {},
		next,
		priority,
		c, i,
		newCost;

	cameFrom[current.id] = null;
	costSoFar[current.id] = 0;

	this.path = [];

	frontier.add(current, 0);
	while (frontier.data.length) {

		current = frontier.remove();

		if (current === goal) {
			break;
		}

		i = current.neighbors.length;
		while (i--) {
			next = current.neighbors[i];

			newCost = costSoFar[current.id] + current.distances[i];

			if ((costSoFar[next.id] !== 0 && !costSoFar[next.id]) || (newCost < costSoFar[next.id])) {

				costSoFar[next.id] = newCost;
				priority = newCost + next.tile.distanceTo(goal.tile);

				frontier.add(next, priority);
				cameFrom[next.id] = current;
			}
		}
	}

	// retrace our steps
	this.path.push(tile);
	next = goal;
	while (next = cameFrom[next.id]) this.path.push(next.tile);
	// path should look like: [goalTile, goalCornerTile, cornerTile, ... cornerTile, closestCornerTile]


	// cleanup sloppy corner connections
	if ( (this.path.length > 2) && this.path[0].traceTo(this.path[2], this.checkTile) ) this.path.splice(1, 1);
	if ( (this.path.length > 2) && this.self.tile.traceTo(this.path[this.path.length - 2], this.checkTile) ) this.path.splice(this.path.length - 1, 1);
	if (this.self.tile === this.path[this.path.length - 1]) this.path.pop();
};

Mover.prototype.checkTile = function(tile) {
	return (tile.isWall) ? false : null;
};

module.exports = Mover;
},{"../../util/initValue":27,"../../util/priorityq":29}],6:[function(require,module,exports){
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
},{"../../util/initValue":27,"./entity":3}],7:[function(require,module,exports){
var Color = require('../../util/color');

// will treat any unknown vars as numbers
// will treat var 'f' & 'b' differently --> if string assume hexString, if object assume Color
var Animation = function(init) {
	var value, i;

	Animation.globalList.push(this);

	this.frames = init.keys; // { 0: {}, [...] 100: {} }
	this.keys = Object.keys(this.frames);

	this.vars = Object.keys(this.frames[0]);
	this.colors = [];
	this.cVars = [];
	
	i = this.vars.length;
	while (i--) {
		value = this.frames[0][this.vars[i]];
		if (typeof value === 'string') {
			this.colors.push(new Color(value));
			this.cVars.push( this.vars.splice(i, 1) );
		}
	}
	this.duration = init.duration; // in seconds

	this.percent = 0;
	this.state = this.frames[this.percent];

	this.repeat = init.repeat;
	this._repeat = this.repeat;

	this.isPlaying = init.isPlaying || false;
};
Animation.prototype.update = function(dt) {

	if (this.isPlaying) {

		this.percent += (100 * dt / this.duration) >> 0;
		if (this.percent > 100) {
			if (this.repeat-- > 0) this.percent = this.percent % 100;
			else return this.stop();
		}

		this.state = this.frames[this.percent] || this.tween();

		if (this.callback) this.callback(this);
	}

	return this.state;
};
Animation.prototype.play = function(percent, callback) {
	this.callback = callback;
	this.percent = percent || 0;
	this.isPlaying = true;
};
Animation.prototype.stop = function() {
	this.isPlaying = false;
	this.repeat = this._repeat;
};
Animation.prototype.tween = function() {
	var p,
		fA, fB,
		f = {},
		i;

	i = this.keys.length;
	while (i--) if (this.keys[i - 1] && (this.keys[i - 1] < this.percent) && (this.keys[i] > this.percent)) break;

	p = (this.percent - this.keys[i - 1]) / (this.keys[i] - this.keys[i - 1]);

	fA = this.frames[this.keys[i - 1]];
	fB = this.frames[this.keys[i]];

	i = this.vars.length;
	while (i--) f[this.vars[i]] = fA[this.vars[i]] + (p * (fB[this.vars[i]] - fA[this.vars[i]]));

	i = this.cVars.length;
	while (i--) {
		// tween color objects and return toHex()
	}

	return f;
};
Animation.globalList = [];
Animation.updateGlobal = function(dt) {
	var i = Animation.globalList.length;
	while(i--) Animation.globalList[i].update(dt);
};

module.exports = Animation;
},{"../../util/color":24}],8:[function(require,module,exports){
var Color = require('../../util/color'),
	ShadowList = require('./shadows');

var Light = function(color, luminosity, tile) {

	this.id = Light.globalList.length;
	Light.globalList.push(this);

	this.tile = tile;

	this.color = new Color(color);
	this.shadows = new ShadowList();

	this.luminosity = luminosity;
	this.radius = Math.sqrt(luminosity / 0.01) >> 0;

	this.shineOn = this.shineOn.bind(this);

	this.isOn = false;
};
Light.prototype.brightness = function(distance) {
	this._alpha = (this.luminosity / distance);
	return (this._alpha > 1) ? 1 : this._alpha;
};
Light.prototype.shineFrom = function(tile) {
	this.tile = tile || this.tile;

	this.shadows.clear();

	this.tile.light += this.luminosity;
	tile.qLights.push( this.color.toRGBA(1.0) );

	this.tile.ripple(this.radius, this.shineOn);
};
Light.prototype.shineOn = function(tile, dx, dy) {

	this._distance = Math.sqrt(dx * dx + dy * dy);

	if (this.shadows.shadowCast(tile, dx, dy, this._distance)) this.drawOn(tile, this._distance);

};
Light.prototype.drawOn = function(tile, distance) {
	this._alpha = this.brightness(distance);
	tile.light += this._alpha;
	tile.qLights.push( [this.color, this._alpha] );
};

Light.globalList = [];
Light.update = function() {
	var i = this.globalList.length;
	while(i--) if (this.globalList[i] !== this && this.globalList[i].isOn) this.globalList[i].shineFrom();
};

module.exports = Light;
},{"../../util/color":24,"./shadows":10}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
var ShadowsList = function() {
	this.list = [];
};
ShadowsList.prototype.isFull = function() {
	return (this.list.length === 1) && (this.list[0][0] === 0) && (this.list[0][1] === 360);
};
/**
 * checks if tile is visible and returns that, but also grows the shadow list if tile casts one
 * @param  {Tile} tile     tile to check
 * @param  {Number} dx       delta x value of tile
 * @param  {Number} dy       delta y value of tile
 * @param  {Number} distance distance from origin to tile
 * @return {Boolean}          true if tile visible, otherwise false
 */
ShadowsList.prototype.shadowCast = function(tile, dx, dy, distance) {

	var angle = Math.atan2(dy , dx),
		i = -1,
		visible = true,
		left,
		right,
		l = false,
		r = false;

	if (angle < 0) angle = (this.twoPI + angle);
	left = angle - this.oneArc / distance;
	right = angle + this.oneArc / distance;
	if (left < 0) left = (this.twoPI + left);

	while (++i < this.list.length) {
		if (!l && left > this.list[i][0] && left < this.list[i][1]) l = true;
		if (!r && right < this.list[i][1] && right > this.list[i][0]) r = true;
	}

	if (tile.isWall) this.addShadow(left, right);

	return !(l && r);
};
ShadowsList.prototype.addShadow = function(left, right) {

	if (left < 0) left = (this.twoPI + left);

	var i = -1,
		l = -1,
		r = -1;

	// handle shadows that cross from high to low angles
	if (left > right) {
		this.addShadow(0, right);
		right = this.twoPI;
	}

	// add or combine the shadow into the sorted list
	if (this.list.length) {

		while (++i < this.list.length) {
			if ((l === -1) && left > this.list[i][0] && left < this.list[i][1]) l = i;
			if ((r === -1) && right < this.list[i][1] && right > this.list[i][0]) r = i;
		}

		if ((l !== r) && ((l > -1) || (r > -1))) {
			if ((l > -1) && (r > -1)) {
				this.list[l][1] = this.list.splice(r, 1)[0][1];
			} else if (l > -1) {
				this.list[l][1] = right;
			} else if (r > -1) {
				this.list[r][0] = left;
			}
		} else if (this.list[0][0] > right) {
			this.list.unshift([left, right]);
		} else {
			i = -1;
			while (++i < this.list.length) {
				if ( (this.list[i][1] < left) && (this.list.length - 1 === i || this.list[i + 1][0] > right) ) {
					this.list.splice(i + 1, 0, [left, right]);
				}
			}
		}
	} else this.list.push([left, right]);

};
ShadowsList.prototype.twoPI = 2 * Math.PI;
ShadowsList.prototype.oneArc = 0.5;
ShadowsList.prototype.clear = function() {
	this.list = [];
};

module.exports = ShadowsList;
},{}],11:[function(require,module,exports){
var _i;

var HUD = {
		meters: [],
		damage: [],
		speech: [],
		effects: []
	};

HUD.update = function() {
	_i = HUD.effects.length;
	while (_i--) ;

	_i = HUD.speech.length;
	while (_i--) HUD.speech[_i].draw();

	_i = HUD.damage.length;
	while (_i--) HUD.damage[_i].draw();

	_i = HUD.meters.length;
	while (_i--) HUD.meters[_i].update();
};

module.exports = HUD;
},{}],12:[function(require,module,exports){
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
},{"../util/dispatch":25,"../util/drawBuffer":26,"./clock":2,"./entity/entity":3,"./fx/animation":7,"./hud":11,"./map":13,"./player":17,"./viewport":18,"./world/world":20}],13:[function(require,module,exports){
var Tile = require('./map/tile'),
	Border = require('./map/border'),
	bitMap = require('../util/bitMap'),
	Corner = require('./map/corner'),
	Marray = require('../util/marray');

var LocalMap = function(LOCAL, area) {
	var x, y;
	this.data = [];

	this.LOCAL = LOCAL;

	this.width = area.width;
	this.height = area.height;

	this.fov = area.fov;
	this.base = area.base;

	// create map tiles
	this.data = Marray(this.width, this.height, function(x, y, a) {
			return new Tile(x, y, area.base.wall, a);
	}.bind(this));

	// and borders for each tile
	this.forEachTile(borderForTile.bind(this));

	// place any prefabs
	if (area.prefabs && area.prefabs.length) area.prefabs.forEach(unpackPrefab.bind(this));

	// prepare any exits
	if (area.exits && area.exits.length) area.exits.forEach(bindExit.bind(this));

	// generate any random tiles
	if (area.generator) {}

	// corners! (for pathfinding)
	(generateCorners.bind(this))();

};
LocalMap.prototype.forEachFloor = function(callback) {
	var x, y, t;

	x = this.width;
	while (x--) {
		y = this.height;
		while (y--) {
			t = this.data[x][y];
			if (!t.isWall) callback(t, x, y);
		}
	}
};
LocalMap.prototype.forEachTile = function(callback) {
	var x, y;

	x = this.data.length;
	while (x--) {
		y = this.data[0].length;
		while (y--) {
			callback(this.data[x][y], x, y);
		}
	}
};
LocalMap.prototype.forEachWall = function(callback) {
	var x, y, t;

	x = this.width;
	while (x--) {
		y = this.height;
		while (y--) {
			t = this.data[x][y];
			if (t.isWall) callback(t, x, y);
		}
	}
};

function unpackPrefab(prefab) {
	this._prefab = prefab;
	bitMap.unpackLive(prefab.walls, applyPrefab.bind(this));
}
function applyPrefab(x, y, isWall) {
	var tile = (this.data[x]) ? this.data[x][y] : undefined;

	if (tile) {
		tile.isWall = isWall;
		if (isWall) {
			tile.bakeOn(this.base.wall);
			tile.occupant = tile;
		} else {
			tile.bakeOn(this.base.floor);
			tile.occupant = null;

			// TODO - Record open tiles at edge of prefab that aren't at edge of map
		}
	}
}
function bindExit(v, i) {
	var tile = this.data[v.x][v.y];

	if (tile) {
		tile.exit = v;
		tile.callback = this.LOCAL.onExit;

		tile.occupant = null;
		tile.isWall = false;
		tile.bakeOn(this.base.exit);

	} else console.warn('exit at index: ' + i + 'is not in map');
}
function borderForTile(tile, x, y) {
	var border = [],
		t;

	tile.border = new Border([]);

	t = (this.data[x-1]) ? this.data[x-1][y-1] : false;
	if (t) {
		tile.border.nw = t;
		tile.border.all.push(t);
	}
	t = (this.data[x-1]) ? this.data[x-1][y] : false;
	if (t) {
		tile.border.w = t;
		tile.border.all.push(t);
	}
	t = (this.data[x-1]) ? this.data[x-1][y+1] : false;
	if (t) {
		tile.border.sw = t;
		tile.border.all.push(t);
	}
	t = (this.data[x]) ? this.data[x][y+1] : false;
	if (t) {
		tile.border.s = t;
		tile.border.all.push(t);
	}
	t = (this.data[x+1]) ? this.data[x+1][y+1] : false;
	if (t) {
		tile.border.se = t;
		tile.border.all.push(t);
	}
	t = (this.data[x+1]) ? this.data[x+1][y] : false;
	if (t) {
		tile.border.e = t;
		tile.border.all.push(t);
	}
	t = (this.data[x+1]) ? this.data[x+1][y-1] : false;
	if (t) {
		tile.border.ne = t;
		tile.border.all.push(t);
	}
	t = (this.data[x]) ? this.data[x][y-1] : false;
	if (t) {
		tile.border.n = t;
		tile.border.all.push(t);
	}
}
function generateCorners() {
	var corners = [],
		c, i;

	// generate corners for map
	this.forEachWall(function(tile) { corners = corners.concat( Corner.cornersFromWall(tile) ); });

	// connect corners to each other
	c = corners.length;
	while (c--) {
		i = c;
		while (i--) Corner.connectCorners(corners[c], corners[i]);
	}
}

module.exports = LocalMap;
},{"../util/bitMap":22,"../util/marray":28,"./map/border":14,"./map/corner":15,"./map/tile":16}],14:[function(require,module,exports){
var Border = function(all) {
	this.n = null;
	this.ne = null;
	this.e = null;
	this.se = null;
	this.s = null;
	this.sw = null;
	this.w = null;
	this.nw = null;

	this.all = all;
	this.i = null;
};
Border.prototype.open = function() {
	var open = [];

	this.i = this.all.length;
	while (this.i--) {
		if (!this.all[this.i].occupant) open.push(this.all[this.i]);
	}

	return open;
};
Border.prototype.closed = function() {
	var closed = [];
	this.i = this.all.length;
	while (this.i--) if (this.all[this.i].isWall) closed.push(this.all[this.i]);

	return closed;
};

module.exports = Border;
},{}],15:[function(require,module,exports){
var Corner = function(tile) {
	this.tile = tile;
	this.id = tile.id;
	tile.corner = this;

	//tile.bakeOn({ b: '#ff0000', f: '#ff0000' });

	this.neighbors = [];
	this.distances = [];
};
Corner.prototype.chooseClosestCornerTo = function(tile, array) {

	if (array.length) this._check = array.shift();
	else return null;

	while (array.length) {
		if (tile.distanceTo(this._check) < tile.distanceTo(array[0])) array.shift();
		else this._check = array.shift();
	}

	return this._check;
};
Corner.prototype.chooseClosestNeighbor = function() {
	var i = this.neighbors.length - 1,
		closest = this.neighbors[i],
		dist = this.distances[i];

	while (i--) if (this.distances[i] < dist) closest = this.neighbors[i];

	return closest;
};
Corner.prototype.selfDestruct = function() {
	this.tile = this.tile.corner = undefined;
};

Corner.cornersFromWall = function(wall) {
	var border = wall.border,
		c = [];

	if (border.nw && border.ne && border.se && border.sw) {

		if (!border.nw.corner && !border.nw.isWall && !border.n.isWall && !border.w.isWall) c.push(new Corner(border.nw));
		if (!border.ne.corner && !border.ne.isWall && !border.n.isWall && !border.e.isWall) c.push(new Corner(border.ne));
		if (!border.se.corner && !border.se.isWall && !border.e.isWall && !border.s.isWall) c.push(new Corner(border.se));
		if (!border.sw.corner && !border.sw.isWall && !border.s.isWall && !border.w.isWall) c.push(new Corner(border.sw));
	}

	return c;
};
Corner.connectCorners = function(A, B) {
	var d = A.tile.distanceTo(B.tile),
		check = function(tile) {
			if ( (tile.isWall) || (tile.corner && tile.corner !== B) || (tile.distanceTo(A.tile) > d) ) return false;
		};

	if (A.tile.traceTo(B.tile, check)) {

		A.neighbors.push(B);
		A.distances.push(d);

		B.neighbors.push(A);
		B.distances.push(d);
	}
};

module.exports = Corner;
},{}],16:[function(require,module,exports){
var Color = require('../../util/color');

var Tile = function(x, y, draw, tiles) {

	this.x = x;
	this.y = y;

	this.id = '' + x + '_' + y;

	this.state = draw;
	this.lit = {f: new Color(draw.f), b: new Color(draw.b) };

	this.setFog();

	this.border = null;
	//this.space = null;
	this.occupant = this;
	this.isWall = true;

	this.light = 0;
	this.qLights = [];
	this.pcCanSee = 0;

	this.tiles = tiles;
};
Tile.prototype.bakeOn = function(draw) {
	this.state = draw;
	if (draw.f) this.lit.f.beHex(draw.f);
	if (draw.b) this.lit.b.beHex(draw.b);

	this.setFog();
};
Tile.prototype.setFog = function() {
	this.fog = {f: new Color(this.state.f), b: new Color(this.state.b) };
	Tile.fog.blend(this.fog.f, 0.5 * this.state.r);
	Tile.fog.blend(this.fog.b, 0.5 * this.state.r);
	this.fog.f.bake();
	this.fog.b.bake();
};
Tile.prototype.occupy = function(entity, override) {
	this.occupant = entity;
	if (!override) {
		if (this.exit) this.callback(entity, this.exit);
		else if (this.callback) this.callback(entity);
	}
};
Tile.prototype.leave = function(entity) {
	this.occupant = null;
};
Tile.prototype.applyLight = function() {
	this.lit.f.reset();
	this.lit.b.reset();
	while ( this._q = this.qLights.pop() ) {
		this._q[0].blend(this.lit.f, this._q[1] * this.state.r);
		this._q[0].blend(this.lit.b, this._q[1] * this.state.r);
	}
	this.light = 0;
};
Tile.prototype.drawPC = function(pcCanSeeId, draw) {
	this.applyLight();
	if (this.pcCanSee === pcCanSeeId) {
		if (this.occupant && !this.isWall) {
			draw.c = this.occupant.state.c;
			draw.f = this.occupant.lit;
			draw.b = this.lit.b;
		} else {
			draw.c = this.state.c;
			draw.f = this.lit.f;
			draw.b = this.lit.b;
		}
	} else {
		draw.c = 0;
		draw.f = Tile.notVisible;
		draw.b = Tile.notVisible;
		if (this.qLights.length) this.qLights = [];
	}

	return draw;
};
Tile.prototype.drawFog = function(pcCanSeeId, draw) {
	if (this.pcCanSee === pcCanSeeId) {
		this.applyLight();
		if (this.occupant && !this.isWall) {
			draw.c = this.occupant.state.c;
			draw.f = this.occupant.lit;
			draw.b = this.lit.b;
		} else {
			draw.c = this.state.c;
			draw.f = this.lit.f;
			draw.b = this.lit.b;
		}
	} else if (this.pcCanSee) {
		draw.c = this.state.c;
		draw.f = this.fog.f;
		draw.b = this.fog.b;
		if (this.qLights.length) this.qLights = [];
	} else {
		draw.c = 0;
		draw.f = Tile.notVisible;
		draw.b = Tile.notVisible;
		if (this.qLights.length) this.qLights = [];
	}

	return draw;
};
Tile.prototype.drawFull = function(pcCanSeeId, draw) {
	this.applyLight();
	if (this.occupant && !this.isWall) {
		draw.c = this.occupant.state.c;
		draw.f = this.occupant.lit;
		draw.b = this.lit.b;
	} else {
		draw.c = this.state.c;
		draw.f = this.lit.f;
		draw.b = this.lit.b;
	}

	return draw;
};
Tile.prototype.ripple = function(radius, callback) {
	var negX = 0,
		negY = 0,
		posX = 0,
		posY = 0,
		tile,
		i;

	while (radius--) {
		// expand right
		if (this.tiles[this.x + posX + 1]) {
			posX++;
			i = negY - 1;
			while (++i <= posY) {
				tile = this.tiles[this.x + posX][this.y + i];
				if (callback(tile, tile.x - this.x, tile.y - this.y) === false) return false;
			}
		}
		// expand bottom
		if (this.tiles[0][this.y + posY + 1]) {
			posY++;
			i = posX + 1;
			while (--i >= negX) {
				tile = this.tiles[this.x + i][this.y + posY];
				if (callback(tile, tile.x - this.x, tile.y - this.y) === false) return false;
			}
		}
		// expand left
		if (this.tiles[this.x + negX - 1]) {
			negX--;
			i = posY + 1;
			while (--i >= negY) {
				tile = this.tiles[this.x + negX][this.y + i];
				if (callback(tile, tile.x - this.x, tile.y - this.y) === false) return false;
			}
		}
		// expand top
		if (this.tiles[0][this.y + negY - 1]) {
			negY--;
			i = negX - 1;
			while (++i <= posX) {
				tile = this.tiles[this.x + i][this.y + negY];
				if (callback(tile, tile.x - this.x, tile.y - this.y) === false) return false;
			}
		}
	}

	return true;
};
Tile.prototype.visibleFlood = function(callback) {
	var walkers = [];

	// first walk to seed
	walkers.push([this.border.n]);
};
Tile.prototype.lineTo = function(tile, callback) {
	var x0 = this.x,
		y0 = this.y,
		x1 = tile.x,
		y1 = tile.y,
		dy = y1 - y0,
		dx = x1 - x0,
		m,
		b;

	if (dx === 0 && dy === 0) return false;
	
	if (dx === 0) { // vertical line
		while (y0++ <= y1) if (callback(this.tiles[x0][y0]) === false) return false;
	} else if (dy === 0) { // horizontal line
		while (x0++ <= x1) if (callback(this.tiles[x0][y0]) === false) return false;
	} else { // angled lines
		m = dy / dx;
		if (m >= 1) {
			b = x0 - (y0 * m);
			while (y0++ <= y1) {
				if (callback(this.tiles[x0][y0]) === false) return false;
				x0 = Math.round((m * y0) + b);
			}
		} else { // m < 1
			b = y0 - (x0 * m);
			while (x0++ <= x1)  {
				if (callback(this.tiles[x0][y0]) === false) return false;
				y0 = Math.round((m * x0) + b);
			}
		}
	}
	return true;
};
Tile.prototype.euclideanDistanceTo = function(tile) {
	return Math.sqrt( Math.pow(tile.x - this.x, 2) + Math.pow(tile.y - this.y, 2) );
};
Tile.prototype.distanceTo = function(tile, dx, dy) { // octile distance
	dx = dx || (tile.x > this.x) ? tile.x - this.x : this.x - tile.x;
	dy = dy || (tile.y > this.y) ? tile.y - this.y : this.y - tile.y;
    return Math.abs((dx + dy) + (this.diagonalDistance - 2) * ((dx > dy) ? dy : dx));
};
Tile.prototype.diagonalDistance = Math.sqrt(2);

Tile.prototype.traceTo = function(tile, callback) {
	var t = this,
		c;

	while (t !== tile) {
		t = t.closestBorder(tile);
		if (t) c = callback(t);
		else return false;

		if (c === false) return false;
		else if (c === true) return true;

	}

	return true;
};

Tile.prototype.closestBorder = function(tile) {
	var t,
		i = this.border.all.length - 1;

	// seed loop with the last in border array
	t = this.border.all[i];
	// replace selection if any subsequent border is closer
	while (i--) if (tile.distanceTo(t) > tile.distanceTo(this.border.all[i])) t = this.border.all[i];

	return t;
};

Tile.prototype.getClosestCorner = function() {
	var selection = null,
		tracer = function(t) {
			if (t.corner) {
				if (!selection || this.distanceTo(selection.tile) > this.distanceTo(t)) {

					selection = t.corner;
					return true;
				}
			} else if (t.isWall) return false;
		}.bind(this);

	if (this.corner) return this.corner;

	this.ripple(this.tiles.length, function(tile, dx, dy) {
		if (tile.corner) this.traceTo(tile, tracer);
		if (selection && (Math.abs(this.x - selection.tile.x) < Math.abs(dx)) && (Math.abs(this.y - selection.tile.y) < Math.abs(dy))) return false;
	}.bind(this));

	return selection;
};

Tile.fog = new Color('#333333');

Tile.notVisible = new Color('#000000');

Tile.directions = ['n', 'e', 's', 'w', 'nw', 'ne', 'se', 'sw'];

module.exports = Tile;
},{"../../util/color":24}],17:[function(require,module,exports){
var Mover = require('./entity/mover'),
	Entity = require('./entity/entity'),
	ShadowsList = require('./fx/shadows'),
	Light = require('./fx/light'),
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
},{"./entity/entity":3,"./entity/mover":5,"./fx/animation":7,"./fx/light":8,"./fx/shadows":10}],18:[function(require,module,exports){
var Color = require('../util/color');

var Viewport = {
	draw: { c: null, f: null, b: null }
};

Viewport.useMap = function(MAP) {
	Viewport.MAP = MAP;
	Viewport.fov = MAP.fov;
	Viewport.drawFunc = (Viewport.fov === 'fog') ? 'drawFog' : (Viewport.fov === 'pc') ? 'drawPC' : 'drawFull';
};

Viewport.checkDims = function(w, h) {
	if ((Viewport.width !== w) && (Viewport.height !== h)) {
		Viewport.width = w;
		Viewport.height = h;

		Viewport.update(Viewport.PC);
	}
};

Viewport.update = function(pc) {
	
	Viewport.PC = pc;

	Viewport.left = pc.tile.x - (Viewport.width / 2) >> 0;
	Viewport.top = pc.tile.y - (Viewport.height / 2) >> 0;
	Viewport.right = Viewport.left + Viewport.width;
	Viewport.bottom = Viewport.top + Viewport.height;
};

Viewport.draw = function(cx, cy) {
	var mx = Viewport.left + cx,
		my = Viewport.top + cy;

	if ((mx > -1 && mx < Viewport.MAP.width) && (my > -1 && my < Viewport.MAP.height)) {
		Viewport.MAP.data[mx][my][Viewport.drawFunc]((Viewport.PC.pcCanSeeId || 0), Viewport.draw);
	} else {
		Viewport.draw.c = Viewport.nullSpace.c;
		Viewport.draw.f = Viewport.nullSpace.fb;
		Viewport.draw.b = Viewport.nullSpace.fb;
	}
	return Viewport.draw;
};

Viewport.getMapTile = function(x, y) {
	var c = Viewport.MAP.data[Viewport.left + x];
	return (c) ? c[Viewport.top + y] : null;
};

Viewport.inBounds = function(tile) {
	return (tile.x < Viewport.right) && (tile.y < Viewport.bottom) && (tile.x >= Viewport.left) && (tile.y >= Viewport.top);
};

Viewport.nullSpace = { c: 0, fb: new Color('#000000') };

module.exports = {

	useMap: Viewport.useMap,

	checkDims: Viewport.checkDims,

	update: Viewport.update,

	draw: Viewport.draw,

	getMapTile: Viewport.getMapTile,

	inBounds: Viewport.inBounds

};
},{"../util/color":24}],19:[function(require,module,exports){
var Builder = {
		Entity: require('../entity/entity'),
		Mover: require('../entity/mover'),
		Sensor: require('../entity/sensor'),
		Mob: require('../entity/mob')
	},
	Dispatch = require('../../util/dispatch');

var Race = function(init) {

	Race.globalList.push(this);

	this.type = init.type || 'Human';
	this.supertype = init.supertype || 'Humanoid';
	this.avgIQ = init.avgIQ || 100;

	this.growth = init.growth || 0.0;
	this.density = init.density || 0.25;
	this.migration = init.migration || 0.25;

	this.relations = init.relations || { 'Human': 100 };
	this.like = [];
	this.dislike = [];

	this.territory = {};
	this.power = 0;

	this.makeup = init.makeup || { 'Average': 1 };

	this.subtypes = init.subtypes || {
		'Average': {
			name: 'Joe Schmoe',
			life: [10, 12],
			states: {
				"active": {c: 2, f: '#ffffff'},
				"dead": {c: 2, f: '#ffffff'}
			},
			odor: 1,
			size: 1,

			Mover: {
				speed: 1
			},
			Sensor: {
				see: 20,
				hear: 7,
				smell: 3
			},
			Mob: {
				power: 4
			}
		}
	};

	this.stereotype = Race.formStereotypeOf(this);

	Dispatch.on('death', this.onDeath.bind(this));
};
Race.prototype.rateLocal = function() {
	var entity,
		feelz,
		i = Builder.Entity.globalList.length;

	this.like = [];
	this.dislike = [];

	while (i--) {
		entity = Builder.Entity.globalList[i];
		if (entity.race || entity.isPC) {
			feelz = this.relations[entity.type];
			if (feelz > 0) this.like.push(entity);
			else if (feelz < 0) this.dislike.push(entity);
		}
	}
};

Race.prototype.onDeath = function(deathEvent) {
	var feelz = this.relations[deathEvent.detail.type];
	if (feelz > 0) this.like.splice(this.like.indexOf(deathEvent.detail), 1);
	else if (feelz < 0) this.dislike.splice(this.dislike.indexOf(deathEvent.detail), 1);
};

Race.prototype.createMob = function(subtype) {
	var keys,
		mob,
		i;

	subtype = this.subtypes[ subtype || Race.subtypeFromMakeup(this.makeup) ];

	subtype.Entity.type = this.type;

	keys = Object.keys(subtype);
	i = -1;
	while (++i < keys.length) mob = new (Builder[ keys[i] ])(mob, subtype[ keys[i] ]);

	mob.race = this;

	return mob;
};

Race.prototype.initIn = function(area, init) {
	var foothold = {
		race: this,
		population: init.population || 0,
		knowledge: init.knowledge || 0,
		growIn: 0
	};

	foothold.learnRate = Math.log(foothold.population * this.avgIQ) / area.size;
	foothold.power = foothold.population * this.stereotype.power;

	this.power += foothold.power;
	this.territory[area.id] = foothold;
	area.mobs[this.type] = foothold;

};

Race.prototype.update = function(area, foothold, dt) {

	if (!this.territory[area.id]) this.territory[area.id] = foothold;

	foothold.knowledge += foothold.learnRate * dt;

	foothold.growIn -= dt;
	if (foothold.growIn <= 0) {

		this.growFoothold(foothold, foothold.population * foothold.growth);

		if ((foothold.population / area.size) > this.density) {
			this.migrate(foothold.population * this.migration, area);
		}
		foothold.growIn += 60;
	}

};

Race.prototype.migrate = function(moving, area) {
	var maybe = [],
		best = 0,
		rating,
		current,
		selection;

	if (moving.id) moving = 1;

	// select best area to move to
	maybe = maybe.concat(area.exits);
	while (current = maybe.pop()) {
		if ((((current.mobs[this.type].population + moving) / current.size) < this.density)) {
			rating = this.rateMobs(current);
			if (rating > best) {
				best = rating;
				selection = current;
			}
		}
	}

	if (selection) this.growFoothold(foothold, moving);
	else area.population /= this.growth;
};

Race.prototype.rateMobs = function(area) {
	var keys = Object.keys(area.mobs),
		i = keys.length,
		mob, rating = 0;

	while (i--) {
		mob = area.mobs[key];
		rating += Math.abs(mob.power - area.mobs[this.type].power) * this.relations[key];
	}

	return rating;
};

Race.prototype.growFoothold = function(foothold, newPop) {
	this.power -= foothold.power;

	foothold.population += newPop;

	foothold.learnRate = Math.log(foothold.population * this.avgIQ) / area.size;
	foothold.power = foothold.population * this.stereotype.power;

	this.power += foothold.power;
};

Race.formStereotypeOf = function(race) {
	var stereotype = {},
		typeKeys,
		partKeys,
		valKeys,
		part,
		type,
		value,
		i,
		j;

	typeKeys = Object.keys(race.subtypes);

	i = typeKeys.length;
	while (i--) { // FOR EACH SUBTYPE
		type = race.subtypes[typeKeys[i]];

		partKeys = Object.keys(type);

		j = partKeys.length;
		while (j--) { // FOR EACH SUBTYPE'S PART
			part = type[partKeys[j]];

			valKeys = Object.keys(part);
			while (value = valKeys.pop()) { // FOR EACH VALUE
				stereotype[value] = stereotype[value] || 0;

				if (typeof part[value] === 'number') {
					stereotype[value] += part[value] * race.makeup[type];
				} else if (Array.isArray(part[value])) {
					stereotype[value] += (part[value][1] + (part[value][0] - part[value][1]) / 2) * race.makeup[type];
				} else break;
			}
		}

	}

	return race;
};

Race.subtypeFromMakeup = function(makeup) {
	var keys,
		subtype,
		m, i;

		keys = Object.keys(makeup);

		if (keys.length > 1) {
			subtype = Math.random();

			m = 0;
			i = keys.length;
			while (i--) {
				m += makeup[keys[i]];
				if ( subtype <= m ) return keys[i];
			}
		} else return keys[0];
};

Race.globalList = [];

module.exports = Race;
},{"../../util/dispatch":25,"../entity/entity":3,"../entity/mob":4,"../entity/mover":5,"../entity/sensor":6}],20:[function(require,module,exports){
var Race = require('./race');

var World = function(worldObj) {
	var keys = Object.keys(worldObj.areas),
		races = Object.keys(worldObj.races);

	keys.forEach(function(key, index){
		var list, i;

		worldObj.areas[key].id = key;

		list = worldObj.areas[key].exits;
		i = list.length;
		while (i--) list[i].to = worldObj.areas[list[i].to];
	});

	this.keys = keys;

	this.areas = worldObj.areas;
	this.current = this.areas[worldObj.start.area];
	this.races = {};

	i = races.length;
	while (i--) this.races[races[i]] = new Race(worldObj.races[races[i]]);
};
World.prototype.update = function(dt) {
	var key,
		i = this.keys.length,
		footholds,
		r;

	while (i--) {
		key = this.keys[i];
		footholds = this.areas[key].footholds;
		r = footholds.length;
		while (r--) {
			foothold = footholds[r];
			if (!foothold.race.type) foothold.race = this.races[foothold.race];
			foothold.race.update(this.areas[key], foothold, dt);
		}
	}
};
World.prototype.migrate = function(mob, toArea) {
	this.current.footholds[mob.race].population--;
	toArea.footholds[mob.race].population++;
};
World.prototype.mobsForArea = function(area) {
	var mobs = [],
		foothold,
		f,
		i;

	// generate mobs from races' foothold
	f = area.footholds.length;
	while (f--) {
		foothold = area.footholds[f];

		// lazy connection of race object to foothold
		if (!foothold.race.type) {
			foothold.race = this.races[foothold.race];
		}

		// create unplaced mobs
		i = foothold.population;
		while (i--) mobs.push( foothold.race.createMob() );
	}

	i = Race.globalList.length;
	while (i--) Race.globalList[i].rateLocal();
	
	return mobs;
};

module.exports = World;
},{"./race":19}],21:[function(require,module,exports){
var table = {
		decFromB62: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15, g: 16, h: 17, i: 18, j: 19, k: 20, l: 21, m: 22, n: 23, o: 24, p: 25, q: 26, r: 27, s: 28, t: 29, u: 30, v: 31, w: 32, x: 33, y: 34, z: 35, A: 36, B: 37, C: 38, D: 39, E: 40, F: 41, G: 42, H: 43, I: 44, J: 45, K: 46, L: 47, M: 48, N: 49, O: 50, P: 51, Q: 52, R: 53, S: 54, T: 55, U: 56, V: 57, W: 58, X: 59, Y: 60, Z: 61 },
		b62FromDec: { 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: 'a', 11: 'b', 12: 'c', 13: 'd', 14: 'e', 15: 'f', 16: 'g', 17: 'h', 18: 'i', 19: 'j', 20: 'k', 21: 'l', 22: 'm', 23: 'n', 24: 'o', 25: 'p', 26: 'q', 27: 'r', 28: 's', 29: 't', 30: 'u', 31: 'v', 32: 'w', 33: 'x', 34: 'y', 35: 'z', 36: 'A', 37: 'B', 38: 'C', 39: 'D', 40: 'E', 41: 'F', 42: 'G', 43: 'H', 44: 'I', 45: 'J', 46: 'K', 47: 'L', 48: 'M', 49: 'N', 50: 'O', 51: 'P', 52: 'Q', 53: 'R', 54: 'S', 55: 'T', 56: 'U', 57: 'V', 58: 'W', 59: 'X', 60: 'Y', 61: 'Z' }
	}, 
	toB62 = function(decimal) {
		var bits,
			num;

		if (decimal === 0) return '0';
		else {
			bits = [];
			num = '';
		}

		while (decimal > 0) {
			bits.push(decimal % 62);
			decimal = (decimal / 62) >> 0;
		}

		while (bits.length) num += table.b62FromDec[bits.pop()];

		return num;
	},
	toB10 = function(base62) {
		var num = 0,
			i = -1;

		while (++i < base62.length) {
			num += ( table.decFromB62[ base62[i] ] * Math.pow(62, base62.length - i - 1) );
		}

		return num;
	};

module.exports = { toB62: toB62, toB10: toB10 };
},{}],22:[function(require,module,exports){
var convert = require('./base62');

module.exports = {
	pack: function(uncompressed) {
		var out = '',
			flag = 0,
			bit = 0,
			row,
			i;

		out += uncompressed[0].length;

		while (row = uncompressed.shift()) {
			i = -1;
			while (++i < row.length) {
				if (row[i] === '#') flag |= Math.pow(2, bit);
                
				if (++bit === 31) {
					out += ' ' + convert.toB62(flag);
					bit = 0;
					flag = 0;
				}
			}
		}
    
		if (bit !== 0) out += ' ' + flag;

		return out;
	},
	unpackLive: function(compressed, callback) {
		var arr = compressed.split(' '),
			width,
			height,
			flag,
			bit,
			x = 0,
			y = 0;

        
		width = parseInt( arr.shift(), 10 );
		height = parseInt( arr.shift(), 10 );
        
		while (arr.length) {
			flag = convert.toB10(arr.shift());

			bit = -1;
			while (++bit < 31) {

				callback( x, y, (flag & Math.pow(2, bit)) ? true : false );

				if (++y === height) {
					if (++x === width) break;
					else y = 0;
				}
			}
		}
	},
	unpack: function(compressed) {
		var out = [],
			row = '',
			arr = compressed.split(' '),
			len,
			flag,
			bit;
        
        len = parseInt( arr.shift(), 10 );
        
		while (arr.length) {
			flag = convert.tob10(arr.shift());
			bit = -1;
			while (++bit < 31) {
				row += (flag & Math.pow(2, bit)) ? '#' : '_';

				if (row.length === len) {
					out.push(row);
					row = '';
                    
                    if ((arr.length === 0) && (30 - bit < len)) break;
				}
			}
		}

		return out;
	}
};
},{"./base62":21}],23:[function(require,module,exports){
var Channel = function(worker) {
	this._worker = worker;
	this._on = { terminate: this._terminate };
	this._i = null;

	this._onMessage = this._onMessage.bind(this);
	worker.addEventListener('message', this._onMessage);
};

Channel.prototype.terminate = function() {

	this._worker.removeEventListener('message', this._onMessage);

	this._worker.postMessage({ id: 'terminate' });
};

Channel.prototype.to = function(name) {

	this[name] = function(data) {
		if (!data) this._worker.postMessage({ id: name });
		else if (data.transfer) this._worker.postMessage({ copy: data.copy, id: name, transfer: data.transfer }, [data.transfer]);
		else this._worker.postMessage({ copy: data.copy, id: name });
	};

	return this[name];
};

Channel.prototype.from = function(name, callback){
	this._on[name] = callback;
};

Channel.prototype.toFrom = function(name, callback) {
	this.from(name, callback);
	return this.to(name);
};

Channel.prototype._onMessage = function(event) {

	if (event.data.id) {

		this._i = this._on[event.data.id];
		if (this._i) this._i(event.data.copy, event.data.transfer);

		this._i = null;
	}
};

Channel.prototype._terminate = function() {
	this._worker.removeEventListener('message', this._onMessage);
};

module.exports = Channel;
},{}],24:[function(require,module,exports){
var Color = function(hex) {
	if (typeof hex === 'string') this.beHex(hex);
	else this.become(hex);
};
Color.prototype.mixInto = function(color, percent) {
	percent = percent || 1.0;

	color.r = (color.r + this.r * percent) / 2 >> 0;
	color.g = (color.g + this.g * percent) / 2 >> 0;
	color.b = (color.b + this.b * percent) / 2 >> 0;

	color._changed = true;

};
Color.prototype.blend = function(dest, percent) {
	var q = 1 - percent;

	dest.r = (dest.r * q + this.r * percent) >> 0;
	dest.g = (dest.g * q + this.g * percent) >> 0;
	dest.b = (dest.b * q + this.b * percent) >> 0;

	dest._changed = true;
};
Color.prototype.toHex = function() {
	if (this._changed) {
		this._hex = '#' + ((this.r > 15) ? '' : '0') + this.r.toString(16) + ((this.g > 15) ? '' : '0') + this.g.toString(16) + ((this.b > 15) ? '' : '0') + this.b.toString(16);
		this._changed = false;
	}

	return this._hex;
};
Color.prototype.beHex = function(hex) {
	this._hex = hex;
	this._changed = false;
	this.r = parseInt( hex.substring(1, 3), 16);
	this.g = parseInt( hex.substring(3, 5), 16);
	this.b = parseInt( hex.substring(5, 7), 16);

	this._r = this.r;
	this._g = this.g;
	this._b = this.b;
};
Color.prototype.become = function(color) {
	this.r = color.r;
	this.g = color.g;
	this.b = color.b;

	this.bake();

	this._changed = true;
};
Color.prototype.bake = function() {
	this._r = this.r;
	this._g = this.g;
	this._b = this.b;
};

Color.prototype.reset = function() {
	this.r = this._r;
	this.g = this._g;
	this.b = this._b;

	this._changed = true;
};
Color._temp = { r: 0, g: 0, b: 0 };
Color.hex2RGB = function(hex) {
	Color._temp.r = parseInt( hex.substring(1, 3), 16);
	Color._temp.g = parseInt( hex.substring(3, 5), 16);
	Color._temp.b = parseInt( hex.substring(5, 7), 16);

	return Color._temp;
};

module.exports = Color;
},{}],25:[function(require,module,exports){
var events = {},
	list,
	i;

var Dispatch = function(event) {
	if (events[event.type]) {
		list = events[event.type];
		i = list.length;
		while (i--) (list[i])(event);
	}
};

Dispatch.on = function(event, callback) {
	if (!events[event]) events[event] = [];
	if (events[event].indexOf(callback) === -1) events[event].push(callback);
};
Dispatch.remove = function(event, callback) {
	events[event].splice(events[event].indexOf(callback), 1);
};

module.exports = Dispatch;
},{}],26:[function(require,module,exports){
var Color = require('../util/color');

var DrawBuffer = function(w, h) {

	if (w && h) this.setBuffer(new ArrayBuffer(w * h * 18), w, h);

	this.offset = 0;
	this._read = { t: { c: null, f: null, b: null }, x: null, y: null };
	this._f = new Color('#000000');
	this._b = new Color('#000000');
};

DrawBuffer.prototype.setBuffer = function(buffer, w, h) {
	this.buffer = buffer;
	this.width = w;
	this.height = h;

	this.reader = new Uint16Array(this.buffer);
	this.length = this.reader.length;
};

DrawBuffer.prototype.read = function() {

	if (this.offset === this.length) {
		this.offset = 0;
		return null;
	}

	this._read.t.c = this.reader[this.offset++];

	this._f.become({
		r: this.reader[this.offset++],
		g: this.reader[this.offset++],
		b: this.reader[this.offset++]
	});
	this._read.t.f = this._f.toHex();

	this._b.become({
		r: this.reader[this.offset++],
		g: this.reader[this.offset++],
		b: this.reader[this.offset++]
	});
	this._read.t.b = this._b.toHex();

	this._read.x = this.reader[this.offset++];
	this._read.y = this.reader[this.offset++];

	if (this._read.t.c === 114) {
		console.log();
	}

	return this._read;
};
DrawBuffer.prototype.write = function(x, y, t) {

	var offset = x * y * 18;

	if (t.c) this.reader[offset++] = t.c;
	else offset++;

	if (t.f) {
		this.reader[offset++] = t.f.r;
		this.reader[offset++] = t.f.g;
		this.reader[offset++] = t.f.b;
	} else offset += 3;

	if (t.b) {
		this.reader[offset++] = t.b.r;
		this.reader[offset++] = t.b.g;
		this.reader[offset++] = t.b.b;
	} else offset += 3;

	this.reader[offset++] = x;
	this.reader[offset++] = y;

	if (offset === this.length) {
		offset = 0;
	}
};

DrawBuffer.prototype.afk = function() {
	return (this.reader.buffer.byteLength === 0);
};

module.exports = DrawBuffer;
},{"../util/color":24}],27:[function(require,module,exports){
module.exports = function(value) {
	if (value.length) return Math.random() * (value[1] - value[0] + 1) + value[0];
	else return value;
};
},{}],28:[function(require,module,exports){
var x,
	y;

/**
 * create mutli-dimensional array
 * @param  {int} x    x dimensions
 * @param  {int} y    y dimensions
 * @param  {function} factory what to init every cell to
 * @return {Array}      returns newly initialized array
 */
var Marray = function(w, h, factory, old) {
	var a = [];
	x = -1;
	while (++x < w) {
		y = -1;
		a.push([]);
		while (++y < h) {
			a[x].push( (old && old[x] && old[x][y]) ? factor(old) : factory(x, y, a) );
		}
	}
	return a;
};

module.exports = Marray;
},{}],29:[function(require,module,exports){
var _i;

var PriorityQ = function() {
	this.data = [];
};
PriorityQ.prototype.add = function(object, priority) {
	var _i = this.data.length;
	if (_i) {
		while (_i--) {
			if (this.data[_i][1] >= priority) {
				this.data.splice(_i + 1, 0, [object, priority]);
				break;
			} else if (_i === 0) {
				this.data.unshift([object, priority]);
				break;
			}
		}
	} else this.data.push([object, priority]);
};
PriorityQ.prototype.remove = function() {
	return this.data.pop()[0];
};
PriorityQ.prototype.removeFromQ = function(object) {
	_i = this.data.length;
	while (_i--) if (this.data[_i][0] === object) break;
	return this.data.splice(_i, 1)[0];
};

module.exports = PriorityQ;
},{}]},{},[1]);
