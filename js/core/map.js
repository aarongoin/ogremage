define(["core/marray"], function(marry) {
    var map = {height: 100, width: 100 };

    map.F = {
                      // 01010101010101010101010101010101 (flag ruler)
        INPCLOS:   1, // 00000000000000000000000000000001 (in player character line of sight)
        NOMOVE:    2, // 00000000000000000000000000000010 (can't move here)
        NOLIGHT:   4, // 00000000000000000000000000000100 (light cannot pass through here)
        ISWALL:    6, // NOMOVE | NOLIGHT
        MAPPED:    8, // 00000000000000000000000000001000 (player has seen this tile before)
        SUNLIT:   16, // 00000000000000000000000000010000 (this tile is sunlit)
        HASOBJ:   32, // 00000000000000000000000000100000 (there's an object here)
        HASMOB:   64, // 00000000000000000000000001000000 (there's a mob here)
        HASITM:  128, // 00000000000000000000000010000000 (there's an item here--could be more than 1)
        CANOPN:  256  // 00000000000000000000000100000000 (door or other portal type)
    };

    map.init = function(w, h) {
        var x = 0, y = 0;
        map = mary(w, h, function() { return {c: 1, f: 3, b: 0, F: 0, O: []}; });
        map.width = w;
        map.height = h;

        // create walls around map
        w--;
        h--;
        while (x <= w) {
            map[x][0].c = 3;
            map[x][0].f = 6;
            map[x][0].F = 6;
            map[x][h].c = 3;
            map[x][h].f = 6;
            map[x][h].F = 6;
            x++;
        }
        while (y <= h) {
            map[0][y].c = 3;
            map[0][y].f = 6;
            map[0][y].F = 6;
            map[w][y].c = 3;
            map[w][y].f = 6;
            map[w][y].F = 6;
            y++;
        }
    };

    return map;
});