var Builder = {
		Entity: require('../entity/entity'),
		Mover: require('../entity/mover'),
		Sensor: require('../entity/sensor'),
		Mob: require('../entity/mob')
	},
	Dispatch = (require('../../util/dispatch')).Central;

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

Race.prototype.onDeath = function(deader) {
	var feelz = this.relations[deader.type];
	if (feelz > 0) this.like.splice(this.like.indexOf(deader), 1);
	else if (feelz < 0) this.dislike.splice(this.dislike.indexOf(deader), 1);
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