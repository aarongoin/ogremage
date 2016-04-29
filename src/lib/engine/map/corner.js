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