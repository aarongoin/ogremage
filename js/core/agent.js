define(["map", "jps"], function(map, jps) {
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

        proto.chooseClosest = proto.chooseClosest || function(tile) {
            var distOld, distNew, closest = false;
                i = tile.length;

            while (i--) {
                // check for closest tile found so far
                if (closest) {
                    // set current tile as closest if it so
                    distNew = Math.abs(tile[i].x - this.x) + Math.abs(tile[i].y - this.y);
                    closest = (distNew > distOld) ? closest : tile[i];
                    distOld = distNew;
                } else {
                    // set first tile in array as the closest tile found so far
                    closest = tile[i];
                    distOld = Math.abs(tile[i].x - this.x) + Math.abs(tile[i].y - this.y);
                }
            }

            return closest;
        };

        proto.moveTo = proto.moveTo || function(x, y) {
            var goal = this.goalPath[0];

            // check that either no goal exists or the new one is different
            if (!goal || (goal.x !== x) || (goal.y !== y)) {
                // get the open tile
                goal = this.map.tileOpen(x, y);
                if (goal) { // success! the tile was open and is a valid goal
                    // get the jump point search path
                    this.goalPath = jps(x, y, this.x, this.y);
                } else { // the tile is not a valid goal
                    // get the surrounding open8
                    goal = this.map.open8(x, y);
                    // are there any open border tiles
                    if (goal) {
                        // get closest tile of those passed
                        goal = this.chooseClosest(goal);
                        // if a closest tile was returned, get the jump point search path
                        if (goal) {
                            this.goalPath = jps(x, y, this.x, this.y);
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