define(["../local/map", "../local/flags", "../display/console"], function(map, flags, con) {
    var prototype = {
        init: function(init) {
            for (var property in init) {
                if (init.hasOwnProperty(property)) this[property] = init[property];
            }
        },
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

        update: function(energy) {
            var i = this.updates.length;
            //while (i--) this.updates[i](energy);
            this.draw();
        },

        draw: function() {
            con.swap(this.x, this.y, this.state);
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

        this.x = init.x || 5;
        this.y = init.y || 5;

        // energy is the baseline of life and hitpoints
        // at energy = 0, the entity is dead
        this.energy = init.energy || 1;
        this.states = init.states || {
             "active": {c: 1, f: 7, F: 66},
            "dormant": {c: 1, f: 7, F: 66},
               "dead": {c: 1, f: 7, F: 66}
        };
        this.state = this.states["dormant"];

        this.updates = [];
        this.update = prototype.update.bind(this);
        this.init = prototype.init.bind(this);
        this.place = prototype.place.bind(this);
        this.draw = prototype.draw.bind(this);
    };
});