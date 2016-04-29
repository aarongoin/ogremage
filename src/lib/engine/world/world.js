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