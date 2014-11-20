define(["./entity", "../local/navnet"], function(entity, navnet) {
    var constructor, prototype;

    constructor = function(proto, init) {
        init = init || {};

        proto.isMobile = true;

        proto.speed = init.speed || 1;
        proto.goalPath = [];

        proto.chooseClosest = init.chooseClosest || prototype.chooseClosest;
        proto.move = init.move || prototype.move;
        proto.moveTo = init.moveTo || prototype.moveTo;
        proto.updates.push(prototype.update);

        return proto;
    };

    prototype = {
        /**
         * get the closest tile to self from stuff passed in
         * @param  {Array} stuff objects to choose closest from. Objects must have "x" and "y" tile coordinates
         * @return {Object}      Return closest object of those passed in
         */
        chooseClosest: function(stuff) {
            var distOld, distNew, closest = false;
                i = stuff.length;

            while (i--) {
                // check for closest tile found so far
                if (closest) {
                    // set current tile as closest if it so
                    distNew = Math.abs(stuff[i].x - this.x) + Math.abs(stuff[i].y - this.y);
                    closest = (distNew > distOld) ? closest : stuff[i];
                    distOld = distNew;
                } else {
                    // set first tile in array as the closest tile found so far
                    closest = stuff[i];
                    distOld = Math.abs(stuff[i].x - this.x) + Math.abs(stuff[i].y - this.y);
                }
            }

            return closest;
        },

        move: function(x, y) {
            var t = this.map.tileOpen(x, y);
            if (t) {
                this.map.Occupy(t, this, this.flags);
                this.map.Unoccupy(this.x, this.y, this.flags);
                this.x = x;
                this.y = y;
                return true;
            }
            return false;
        },
        /**
         * set point as mobile's goal and pathfind to it.
         * @param  {Number} x map x coordinate
         * @param  {Number} y map y coordinate
         * @return {Boolean}   true if successful, false if not
         */
        moveTo: function(x, y) {
            var goal = this.goalPath[this.goalPath.length - 1];

            // check that either no goal exists or the new one is different
            if (!goal || (goal.x !== x) || (goal.y !== y)) {
                // get the open tile
                goal = this.map.tileOpen(x, y);
                if (goal) { // success! the tile was open and is a valid goal
                    // get the jump point search navnet
                    this.goalPath = navnet(x, y, this.x, this.y);
                    return true;
                } else { // the tile is not a valid goal
                    // get the surrounding open8
                    goal = this.map.open8(x, y);
                    // are there any open border tiles
                    if (goal) {
                        // get closest tile of those passed
                        goal = this.chooseClosest(goal);
                        // if a closest tile was returned, get the jump point search navnet
                        if (goal) {
                            this.goalPath = navnet(this.x, this.y, x, y);
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            } else {
                return false;
            }
        },
        /**
         * update!
         * @param  {array} array of bordering tiles
         */
        update: function(borders) {
            var i = borders.length,
                p = this.goalPath[0];
            borders = borders || this.map.border8();

            while (i--) {
                if (p && (p.x === borders[i].x) && (p.y === borders[i].y) &&
                    (p.type === "move") && (this.agency >= (p.cost / this.speed))) {
                    if (!borders.occupied) {
                        this.move(p.x, p.y);
                        this.goalPath.shift();
                    } else {
                        // TODO - handle rerouting because target tile is blocked
                    }
                }
            }
        }
    };

    return function(init) {
        if (init && init.isEntity) return constructor(init);
        return constructor(new entity(init), init);
    };
});