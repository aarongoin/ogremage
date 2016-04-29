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