define(["../map", "../flags"], function(map, flags) {
    var prototype = {
        update: function() {
            var i = this.updates.length;
            while (i--) this.updates[i]();
        }
    };
    return function(init) {
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

        // initialize on map
        tile = map.tileOpen(init.x, init.y);
        if (!tile) return false;
        map.Occupy(tile, init, init.states[init.state]);
    };
});