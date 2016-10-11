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
	if ( (this.path.length > 2) && this.self.tile.traceTo(this.path[this.path.length - 3], this.checkTile) ) this.path.splice(this.path.length - 2, 1);
	if (this.self.tile === this.path[this.path.length - 1]) this.path.pop();
};

Mover.prototype.checkTile = function(tile) {
	return (tile.isWall) ? false : null;
};

module.exports = Mover;