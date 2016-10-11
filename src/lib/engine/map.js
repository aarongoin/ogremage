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
			tile.occupant = [];
			tile.space = 1;

			// TODO - Record open tiles at edge of prefab that aren't at edge of map
		}
	}
}
function bindExit(v, i) {
	var tile = this.data[v.x][v.y];

	if (tile) {
		tile.exit = v;
		tile.callback = this.LOCAL.onExit;

		tile.occupant = [];
		tile.space = 1;
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