define(["core/marray"], function(mary) {
    var map = {},
        height = 100,
        width = 100,
        view = {},
        F = {
            INPCLOS:   1, // 0000000001 (in player character line of sight)
            NOMOVE:    2, // 0000000010 (can't move here)
            NOLIGHT:   4, // 0000000100 (light cannot pass through here)
            ISWALL:    6, // NOMOVE | NOLIGHT
            MAPPED:    8, // 0000001000 (player has seen this tile before)
            SUNLIT:   16, // 0000010000 (this tile is sunlit)
            HASOBJ:   32, // 0001000000 (there's an object here)
            HASMOB:   64, // 0010000000 (there's a mob here)
            HASITM:  128, // 0100000000 (there's an item here--could be more than 1)
            CANOPN:  256  // 1000000000 (door or other portal type)
        };


        var initMap = function(w, h) {
            var x = 0, y = 0;
            map = mary(w, h, {  c: 1, f: 3, b: 0, // map tile
                                F: 0, O: []}); // flags and objects
            width = w;
            height = h;

            // create walls around map
            w--;
            h--;
            while (x <= w) {
                map[x][0] = {c: 3, f:6, b: 0, F: 6, O: []};
                map[x][h] = {c: 3, f:6, b: 0, F: 6, O: []};
                x++;
            }
            while (y <= h) {
                map[0][y] = {c: 3, f:6, b: 0, F: 6, O: []};
                map[w][y] = {c: 3, f:6, b: 0, F: 6, O: []};
                y++;
            }



        };

    return {
        resize: function(w, h) {
            width = (w > 0) ? w : width;
            height = (h > 0) ? h : height;
        },

        init: function(dims) {
            initMap(dims[0], dims[1]);
        },

        dim: function() {
            return [width, height];
        }
    };
});