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