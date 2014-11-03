define(["map", "path"], function(map, path) {
    var agent;

    agent = function(init, proto) {
        init = init || {};
        proto = proto || {};

        // default attributes
        init.title = init.title || "Agent";
        init.name = init.name || "";

        // Agent base stats
        init.health = init.health || 1;
        init.speed = init.speed || 1;

        // Agent action stuff
        init.agency = init.agency || 1;
        init.goalPath = init.goalPath || [];
        init.x = init.x || 0;
        init.y = init.y || 0;

        // Agent physical characteristics
        init.flags = init.flags || 66;
        init.sprite = init.sprite || 2;
        init.color = init.color || 7;

        // setup prototype
        proto.map = map;

        proto.move =  proto.move || function(x, y) {
            var t = this.map.tileOpen(x, y);
            if (t) {
                this.map.Occupy(t, this);
                this.map.Unoccupy(x, y);
            } else {
                // TODO - reroute or choose a temporary tile to move to
            }
        };

        /**
         * get the closest tile to self from stuff passed in
         * @param  {Array} stuff objects to choose closest from. Objects must have "x" and "y" tile coordinates
         * @return {Object}      Return closest object of those passed in
         */
        proto.chooseClosest = proto.chooseClosest || function(stuff) {
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
        };

        /**
         * set point as agent's goal and pathfind to it.
         * @param  {Number} x map x coordinate
         * @param  {Number} y map y coordinate
         * @return {Boolean}   true if successful, false if not
         */
        proto.moveTo = proto.moveTo || function(x, y) {
            var goal = this.goalPath[this.goalPath.length - 1];

            // check that either no goal exists or the new one is different
            if (!goal || (goal.x !== x) || (goal.y !== y)) {
                // get the open tile
                goal = this.map.tileOpen(x, y);
                if (goal) { // success! the tile was open and is a valid goal
                    // get the jump point search path
                    this.goalPath = path(x, y, this.x, this.y);
                    return true;
                } else { // the tile is not a valid goal
                    // get the surrounding open8
                    goal = this.map.open8(x, y);
                    // are there any open border tiles
                    if (goal) {
                        // get closest tile of those passed
                        goal = this.chooseClosest(goal);
                        // if a closest tile was returned, get the jump point search path
                        if (goal) {
                            this.goalPath = path(this.x, this.y, x, y);
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            } else {
                return false;
            }
        };

        // TODO - how to implement this?
        //proto.moveToAct = (proto.moveToAct) ? proto.moveToAct : moveToAct;
        init.prototype = proto;

        return init;
    };

    return agent;
});