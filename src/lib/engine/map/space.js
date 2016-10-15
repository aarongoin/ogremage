function Point(draw) {
	var self = {
		free: 1,
		entities: [],
		num: 0,
		drawn: null,
		draw: draw
	}
	this.canOccupy = _canOccupy.bind(self);
	this.occupy = _occupy.bind(self);
	this.leave = _leave.bind(self);
	this.draw = _draw.bind(self);

	this.n = null;
	this.ne = null;
	this.e = null;
	this.se = null;
	this.s = null;
	this.sw = null;
	this.w = null;
	this.nw = null;
} 

function _canOccupy(size) {
	return (free >= size);
}

function _occupy(entity) {
	if (entity.draw) {
		if (!this.drawn || (entity.height > this.drawn.height)) this.drawn = entity;
	}
	this.entities.push(entity);
	if (this.entities.length > 1) possibleCollision(this.entities);
}

function _leave(entity) {
	this.entities[entity.id] = undefined;
	this.free += entity.size;
}
function _draw() {
	return (this.drawn) ? this.drawn.draw : this.draw;
}

function Space(w, h, draw) {
	var space = [],
		x = -1,
		y;

	while (++x < w) {
		space.push([]);
		y = -1;
		while (++x < h) {
			// create point in space
			space[x][y] = new Point(draw);
			if (x !== 0) {
				// west-east connections
				space[x][y].w = space[x - 1][y];
				space[x - 1][y].e = space[x][y];

				if (y !== 0) {
					// north-south connections
					space[x][y].n = space[x][y - 1];
					space[x][y - 1].s = space[x][y];

					// northwest-southeast connections
					space[x][y].nw = space[x - 1][y - 1];
					space[x - 1][y - 1].se = space[x][y];
				}
				if (y !== (h - 1)) {
					// southwest-northeast connections
					space[x][y].sw = space[x - 1][y + 1];
					space[x - 1][y + 1].ne = space[x][y];
				}
			}
		}
	}
	// freeze point to prevent border modification
	space.forEach(function(e) { Object.freeze(e) });
	return space;
}

module.exports = {
	Space: Space
};