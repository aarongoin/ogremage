define(["../local/map", "../local/flags"], function(map, flags) {
    var prototype = {
        place: function(x, y) {
            var open,
                tile = map.tileOpen(x, y);
            if (tile) {
                this.x = x;
                this.y = y;
                return true;
            }

            open = map.open8(x, y);
            if (open) {
                this.x = x + open[0].dx;
                this.y = y + open[0].dy;
                return true;
            } else return false;
        },

        update: function() {
            var i = this.updates.length;
            while (i--) this.updates[i]();
        }
    };

    return function(init) {
        init = init || {};

        var tile;

        this.isEntity = true;
        this.title = init.title || "Entity";
        this.name = init.name || "";

        this.map = map;
        this.flags = flags;

        this.x = init.x || 0;
        this.y = init.y || 0;

        // energy is the baseline of life and hitpoints
        // at energy = 0, the entity is dead
        this.energy = init.energy || 1;
        this.states = init.states || {
             "active": {c: 2, f: 7, F: 66},
            "dormant": {c: 2, f: 7, F: 66},
               "dead": {c: 2, f: 7, F: 66}
        };
        this.state = "dormant";

        this.updates = [];
        this.update = prototype.update;

        this.place = prototype.place;
    };
});