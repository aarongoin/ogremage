define(["./entity", "../local/map"], function(entity, map) {
    var constructor, prototype;

    constructor = function(proto, init) {
        init = init || {};

        proto.isMobile = true;

        proto.speed = init.speed || 1;
        proto.destination = init.destination || null;

        proto.chooseClosest = prototype.chooseClosest.bind(proto);
        proto.move = prototype.move.bind(proto);
        proto.moveTo = prototype.moveTo.bind(proto);
        proto.updates.push(prototype.update.bind(proto));

        return proto;
    };

    prototype = {
        /**
         * get the closest tile to self from stuff passed in
         * @param  {Array} stuff objects to choose closest from. Objects must have "x" and "y" tile coordinates
         * @return {Object}      Return closest object of those passed in
         */
        chooseClosest: function(x, y, stuff) {
            var distOld, distNew, closest = false,
                i = stuff.length;

            while (i--) {
                // check for closest tile found so far
                if (closest) {
                    // set current tile as closest if it so
                    distNew = Math.abs(stuff[i].x - x) + Math.abs(stuff[i].y - y);
                    closest = (distNew > distOld) ? closest : stuff[i];
                    distOld = (distNew > distOld) ? distOld : distNew;
                } else {
                    // set first tile in array as the closest tile found so far
                    closest = stuff[i];
                    distOld = Math.abs(stuff[i].x - x) + Math.abs(stuff[i].y - y);
                }
            }

            return closest;
        },

        move: function(x, y) {
            var t = map.tileOpen(x, y);
            if (t) {
                map.Occupy(t, this, this.state);
                map.Unoccupy(this.x, this.y, this.state);
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
            this.destination = map.data[x][y];
        },
        /**
         * update!
         * @param  {array} array of bordering tiles
         */
        update: function(borders) {
            var i, x, y;
            borders = borders || map.border8(this.x, this.y);

            if (this.state.t === "active") {
                if (this.destination) {
                    x = this.destination.x;
                    y = this.destination.y;
                    i = borders.indexOf(this.destination);
                    if (i !== -1) {
                        this.move(x, y);
                        this.destination = false;
                    } else {
                        // move to open8 tile closest to destination
                        i = this.chooseClosest(x, y, map.open8(this.x, this.y));
                        this.move(i.x, i.y);
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