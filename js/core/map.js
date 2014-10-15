define(["core/marray", "core/flags"], function(marry, flags) {
    var map = {height: 100, width: 100 };

    map.init = function(w, h) {
        var x = 0, y = 0;
        map = marry(w, h, function() { return {c: 1, f: 3, b: 0, F: 1}; });
        map.width = w;
        map.height = h;

        // create walls around map
        w--;
        h--;
        while (x <= w) {
            map[x][0].c = 3;
            map[x][0].f = 6;
            map[x][0].F |= flags.ISWALL;
            map[x][h].c = 3;
            map[x][h].f = 6;
            map[x][h].F |= flags.ISWALL;
            x++;
        }
        while (y <= h) {
            map[0][y].c = 3;
            map[0][y].f = 6;
            map[0][y].F |= flags.ISWALL;
            map[w][y].c = 3;
            map[w][y].f = 6;
            map[w][y].F |= flags.ISWALL;
            y++;
        }
    };

    return map;
});